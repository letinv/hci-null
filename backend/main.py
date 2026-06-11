from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import json
import os
from pathlib import Path

try:
    import anthropic as _anthropic_lib
    _claude = _anthropic_lib.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))
except Exception:
    _claude = None

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://hci-null.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Claude helpers ─────────────────────────────────────────────────────────────

_SYSTEM = "You are a photo editing assistant. Return ONLY valid JSON — no markdown, no code fences, no extra text."

_FILTER_SCHEMA = """{
  "styleName": "short name",
  "styleDescription": "one sentence",
  "options": [
    {"id":"A","label":"...","filter":"brightness(1.1) contrast(1.05) saturate(1.2)","tags":["t1","t2","t3"],"explanation":"..."},
    {"id":"B","label":"...","filter":"brightness(0.92) contrast(1.28) saturate(0.8) sepia(0.08)","tags":["t1","t2","t3"],"explanation":"..."},
    {"id":"C","label":"...","filter":"brightness(1.18) contrast(0.9) saturate(1.1) sepia(0.15)","tags":["t1","t2","t3"],"explanation":"..."}
  ]
}"""

_FILTER_RULES = """CSS filter constraints:
- brightness: 0.75–1.40  (1.0 = normal)
- contrast:   0.80–1.45
- saturate:   0.65–1.55
- sepia:      0.00–0.40  (optional)
- hue-rotate: optional, e.g. hue-rotate(15deg)
Make the 3 options VISUALLY DISTINCT — vary brightness, contrast, and saturation significantly across options."""


def _claude_text(prompt: str) -> dict | None:
    if not _claude:
        return None
    try:
        msg = _claude.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            system=_SYSTEM,
            messages=[{"role": "user", "content": prompt}],
        )
        return json.loads(msg.content[0].text)
    except Exception:
        return None


def _claude_vision(image_url: str, text: str) -> dict | None:
    if not _claude:
        return None
    try:
        msg = _claude.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            system=_SYSTEM,
            messages=[{
                "role": "user",
                "content": [
                    {"type": "image", "source": {"type": "url", "url": image_url}},
                    {"type": "text", "text": text},
                ],
            }],
        )
        return json.loads(msg.content[0].text)
    except Exception:
        return None


# =========================
# TASK 1 — MOOD EDIT
# =========================

class MoodEditRequest(BaseModel):
    mood: str
    image_name: str
    mode: str = "text"
    reference_image_url: str | None = None
    library_preset: str | None = None


def _mood_fallback(mood: str) -> dict:
    m = mood.lower().strip()
    if "warm" in m or "evening" in m or "sunset" in m:
        return {
            "styleName": "warm evening",
            "styleDescription": "A warm, soft-toned edit for a cozy evening atmosphere.",
            "options": [
                {"id": "A", "label": "warm cinematic", "filter": "brightness(1.15) contrast(1.12) saturate(1.35) sepia(0.18)", "tags": ["warm", "cinematic", "golden"], "explanation": "Adds warmer tones, stronger color depth, and a soft cinematic mood."},
                {"id": "B", "label": "golden soft",    "filter": "brightness(1.22) contrast(1.02) saturate(1.25) sepia(0.28)", "tags": ["golden", "soft", "gentle"],   "explanation": "Creates a lighter golden look with softer contrast and a calm mood."},
                {"id": "C", "label": "muted sunset",   "filter": "brightness(0.98) contrast(1.18) saturate(1.05) sepia(0.25)", "tags": ["muted", "sunset", "soft contrast"], "explanation": "Keeps the image more muted while adding sunset-like warmth."},
            ],
        }
    elif "clean" in m or "bright" in m or "fresh" in m or "daylight" in m:
        return {
            "styleName": "clean daylight",
            "styleDescription": "A bright and natural edit with a fresh, clean look.",
            "options": [
                {"id": "A", "label": "clean daylight", "filter": "brightness(1.22) contrast(1.08) saturate(1.05)",             "tags": ["clean", "bright", "natural"], "explanation": "Brightens the image and keeps the colors natural and clear."},
                {"id": "B", "label": "fresh minimal",  "filter": "brightness(1.28) contrast(0.96) saturate(0.92)",             "tags": ["fresh", "minimal", "soft"],   "explanation": "Creates a soft, minimal look with reduced contrast and lighter tones."},
                {"id": "C", "label": "clear contrast", "filter": "brightness(1.12) contrast(1.22) saturate(1.0)",              "tags": ["clear", "crisp", "balanced"], "explanation": "Adds clarity and contrast while keeping the overall mood clean."},
            ],
        }
    elif "cinematic" in m or "film" in m or "moody" in m:
        return {
            "styleName": "cinematic film",
            "styleDescription": "A more dramatic edit inspired by film-like color grading.",
            "options": [
                {"id": "A", "label": "soft cinematic", "filter": "brightness(0.95) contrast(1.25) saturate(0.8)",              "tags": ["cinematic", "soft", "dramatic"], "explanation": "Adds contrast and lowers saturation for a soft movie-like look."},
                {"id": "B", "label": "film contrast",  "filter": "brightness(0.9) contrast(1.38) saturate(0.72) sepia(0.1)",   "tags": ["film", "contrast", "muted"],    "explanation": "Creates stronger shadows and muted tones for a film-inspired result."},
                {"id": "C", "label": "moody fade",     "filter": "brightness(0.88) contrast(1.12) saturate(0.65) sepia(0.06)", "tags": ["moody", "faded", "low saturation"], "explanation": "Makes the photo calmer and moodier with faded colors."},
            ],
        }
    elif "soft" in m or "pastel" in m or "dreamy" in m:
        return {
            "styleName": "soft pastel",
            "styleDescription": "A gentle edit with low contrast and soft color tones.",
            "options": [
                {"id": "A", "label": "soft pastel",   "filter": "brightness(1.18) contrast(0.88) saturate(0.9)",  "tags": ["soft", "pastel", "gentle"],  "explanation": "Reduces harsh contrast and creates a soft pastel-like mood."},
                {"id": "B", "label": "dreamy light",  "filter": "brightness(1.25) contrast(0.82) saturate(0.82)", "tags": ["dreamy", "light", "airy"],   "explanation": "Makes the image brighter and lighter with a dreamy atmosphere."},
                {"id": "C", "label": "soft natural",  "filter": "brightness(1.12) contrast(0.92) saturate(0.95)", "tags": ["natural", "soft", "balanced"], "explanation": "Keeps the photo natural while softening the overall look."},
            ],
        }
    else:
        return {
            "styleName": "balanced natural",
            "styleDescription": "A balanced edit for general mood descriptions.",
            "options": [
                {"id": "A", "label": "natural edit",   "filter": "brightness(1.08) contrast(1.08) saturate(1.08)", "tags": ["natural", "balanced", "clear"],   "explanation": "Improves brightness, contrast, and saturation in a balanced way."},
                {"id": "B", "label": "soft balanced",  "filter": "brightness(1.08) contrast(0.95) saturate(0.92)", "tags": ["soft", "balanced", "calm"],       "explanation": "Creates a softer version with lower contrast and calmer colors."},
                {"id": "C", "label": "crisp natural",  "filter": "brightness(1.02) contrast(1.25) saturate(1.05)", "tags": ["crisp", "natural", "contrast"],   "explanation": "Adds stronger contrast while keeping the image natural."},
            ],
        }


@app.post("/mood-edit")
def mood_edit(data: MoodEditRequest):
    result = None

    if data.mode == "image" and data.reference_image_url:
        text = (
            "Analyze this reference image's visual style, color palette, and mood. "
            "Generate 3 filter options that match or complement this aesthetic.\n\n"
            f"Return JSON matching this schema:\n{_FILTER_SCHEMA}\n\n{_FILTER_RULES}"
        )
        result = _claude_vision(data.reference_image_url, text)

    elif data.mode == "library" and data.library_preset:
        prompt = (
            f'Based on the saved mood preset named "{data.library_preset}", '
            f"generate 3 filter variations that expand on this style.\n\n"
            f"Return JSON matching this schema:\n{_FILTER_SCHEMA}\n\n{_FILTER_RULES}"
        )
        result = _claude_text(prompt)

    elif any(word in mood for word in [
        "cool", "blue", "cold", "winter", "ocean", "rain", "rainy",
        "sky", "icy", "calm blue", "deep blue", "night blue",
        "silver", "fog", "mist", "cool tones"
    ]):
        style_name = "cool blue"
        style_description = "A cool-toned edit with calm blue and silver highlights."

        options = [
            {
                "id": "A",
                "label": "cool minimal",
                "filter": "brightness(1.05) contrast(1.08) saturate(0.88) hue-rotate(8deg)",
                "tags": ["cool", "minimal", "clean"],
                "explanation": "Creates a calm and minimal cool-toned atmosphere."
            },
            {
                "id": "B",
                "label": "rainy blue",
                "filter": "brightness(0.96) contrast(1.15) saturate(0.82) hue-rotate(12deg)",
                "tags": ["blue", "rainy", "moody"],
                "explanation": "Adds deeper blue shadows inspired by rainy city lighting."
            },
            {
                "id": "C",
                "label": "silver fade",
                "filter": "brightness(1.08) contrast(0.92) saturate(0.75)",
                "tags": ["silver", "faded", "soft"],
                "explanation": "Softens colors into a cooler silver-toned aesthetic."
            }
        ]

    elif any(word in mood for word in [
        "vintage", "retro", "old film", "analog", "nostalgia",
        "90s", "film camera", "grain", "classic", "faded memory",
        "old photo", "vhs", "vintage summer"
    ]):
        style_name = "vintage film"
        style_description = "A nostalgic edit inspired by old film photography."

        options = [
            {
                "id": "A",
                "label": "film memory",
                "filter": "brightness(1.02) contrast(0.94) saturate(0.88) sepia(0.18)",
                "tags": ["film", "nostalgic", "warm"],
                "explanation": "Creates a soft nostalgic atmosphere inspired by film cameras."
            },
            {
                "id": "B",
                "label": "retro faded",
                "filter": "brightness(1.08) contrast(0.85) saturate(0.78) sepia(0.22)",
                "tags": ["retro", "faded", "soft"],
                "explanation": "Adds faded tones and softer contrast for a retro look."
            },
            {
                "id": "C",
                "label": "classic analog",
                "filter": "brightness(0.98) contrast(1.12) saturate(0.82) sepia(0.12)",
                "tags": ["analog", "classic", "film"],
                "explanation": "Balances muted colors and contrast to simulate analog photography."
            }
        ]


    elif any(word in mood for word in [
        "dark", "noir", "black", "midnight", "shadow", "mysterious",
        "deep shadows", "dark cinematic", "night city", "intense",
        "dramatic night", "low exposure"
    ]):
        style_name = "dark noir"
        style_description = "A dark cinematic edit with strong shadows and dramatic contrast."

        options = [
            {
                "id": "A",
                "label": "midnight noir",
                "filter": "brightness(0.82) contrast(1.35) saturate(0.72)",
                "tags": ["dark", "night", "cinematic"],
                "explanation": "Creates a deep cinematic night atmosphere with stronger shadows."
            },
            {
                "id": "B",
                "label": "urban shadow",
                "filter": "brightness(0.88) contrast(1.28) saturate(0.76)",
                "tags": ["urban", "shadow", "moody"],
                "explanation": "Enhances darker areas while keeping an urban editorial mood."
            },
            {
                "id": "C",
                "label": "dramatic fade",
                "filter": "brightness(0.92) contrast(1.18) saturate(0.68)",
                "tags": ["dramatic", "faded", "deep"],
                "explanation": "Softens the image slightly while maintaining dramatic contrast."
            }
        ]

    else:
        mood_input = data.mood or data.library_preset or "natural balanced"
        prompt = (
            f'Mood description: "{mood_input}"\n\n'
            f"Generate 3 photo filter options that match this mood.\n\n"
            f"Return JSON matching this schema:\n{_FILTER_SCHEMA}\n\n{_FILTER_RULES}"
        )
        result = _claude_text(prompt)

    if result and result.get("options"):
        return {
            "originalImage": data.image_name,
            "mood": data.mood,
            "styleName": result.get("styleName", "custom style"),
            "styleDescription": result.get("styleDescription", ""),
            "generatedResults": result["options"],
        }

    # Fallback
    fb = _mood_fallback(data.mood or data.library_preset or "")
    return {
        "originalImage": data.image_name,
        "mood": data.mood,
        "styleName": fb["styleName"],
        "styleDescription": fb["styleDescription"],
        "generatedResults": fb["options"],
    }


class AdjustEditRequest(BaseModel):
    selected_option: str
    base_filter: str
    warmth: int
    intensity: int
    softness: int


@app.post("/adjust-edit")
def adjust_edit(data: AdjustEditRequest):
    brightness = 1 + (data.intensity - 50) / 250
    contrast = 1 + (data.intensity - 50) / 200
    saturate = 1 + (data.warmth - 50) / 180
    sepia = max(0, min(0.35, data.warmth / 300))
    blur = max(0, (data.softness - 50) / 80)

    adjusted_filter = (
        f"brightness({brightness:.2f}) "
        f"contrast({contrast:.2f}) "
        f"saturate({saturate:.2f}) "
        f"sepia({sepia:.2f}) "
        f"blur({blur:.2f}px)"
    )

    return {
        "selectedOption": data.selected_option,
        "adjustedFilter": adjusted_filter,
        "parameters": {
            "warmth": data.warmth,
            "intensity": data.intensity,
            "softness": data.softness,
        },
    }


PRESETS_FILE = Path("presets.json")


class SavePresetRequest(BaseModel):
    mood: str
    style_name: str
    selected_option: str
    filter: str
    tags: list[str] = []
    explanation: str = ""


@app.post("/save-preset")
def save_preset(data: SavePresetRequest):
    preset = {
        "id": len(load_presets()) + 1,
        "mood": data.mood,
        "styleName": data.style_name,
        "selectedOption": data.selected_option,
        "filter": data.filter,
        "tags": data.tags,
        "explanation": data.explanation,
    }

    presets = load_presets()
    presets.append(preset)

    with open(PRESETS_FILE, "w", encoding="utf-8") as f:
        json.dump(presets, f, ensure_ascii=False, indent=2)

    return {"status": "saved", "preset": preset}


def load_presets():
    if not PRESETS_FILE.exists():
        return []
    with open(PRESETS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


@app.get("/library")
def get_library():
    return {"presets": load_presets()}


@app.delete("/delete-preset/{preset_id}")
def delete_preset(preset_id: int):
    presets = load_presets()
    updated_presets = [p for p in presets if p["id"] != preset_id]
    with open(PRESETS_FILE, "w", encoding="utf-8") as f:
        json.dump(updated_presets, f, ensure_ascii=False, indent=2)
    return {"status": "deleted", "deletedPresetId": preset_id}


@app.get("/gallery")
def get_gallery():
    gallery_images = [
        {"id": 1, "src": "https://picsum.photos/seed/cafe-set-1/800/800", "category": "cafe"},
        {"id": 2, "src": "https://picsum.photos/seed/cafe-set-2/800/800", "category": "cafe"},
        {"id": 3, "src": "https://picsum.photos/seed/cafe-set-3/800/800", "category": "cafe"},
        {"id": 4, "src": "https://picsum.photos/seed/cafe-set-4/800/800", "category": "cafe"},
        {"id": 5, "src": "https://picsum.photos/seed/street-set-1/800/800", "category": "street"},
        {"id": 6, "src": "https://picsum.photos/seed/street-set-2/800/800", "category": "street"},
        {"id": 7, "src": "https://picsum.photos/seed/street-set-3/800/800", "category": "street"},
        {"id": 8, "src": "https://picsum.photos/seed/street-set-4/800/800", "category": "street"},
        {"id": 9, "src": "https://picsum.photos/seed/travel-set-1/800/800", "category": "travel"},
        {"id": 10, "src": "https://picsum.photos/seed/travel-set-2/800/800", "category": "travel"},
        {"id": 11, "src": "https://picsum.photos/seed/travel-set-3/800/800", "category": "travel"},
        {"id": 12, "src": "https://picsum.photos/seed/travel-set-4/800/800", "category": "travel"},
    ]
    return {"images": gallery_images}


# =========================
# TASK 2 — CONSISTENCY EDIT
# =========================

class ConsistencyRequest(BaseModel):
    images: list[str]
    preset: str
    mode: str = "text"
    reference_image_url: str | None = None


@app.post("/consistency-edit")
def consistency_edit(data: ConsistencyRequest):
    base_filter = None
    style_name = None
    summary = None

    _CONSISTENCY_SCHEMA = '{"styleName":"...","baseFilter":"brightness(1.05) contrast(1.1) saturate(1.05)","summary":"one sentence"}'
    _CONSISTENCY_RULES = "Return a single CSS filter string in baseFilter. brightness 0.80–1.35, contrast 0.85–1.40, saturate 0.70–1.45, sepia 0.00–0.35 optional."

    if data.mode == "image" and data.reference_image_url:
        text = (
            "Analyze this reference image's visual style and generate a single consistent CSS filter "
            "that captures its aesthetic for a batch of photos.\n\n"
            f"Return JSON: {_CONSISTENCY_SCHEMA}\n\n{_CONSISTENCY_RULES}"
        )
        result = _claude_vision(data.reference_image_url, text)
    elif data.mode == "library" and data.preset:
        prompt = (
            f'Based on the mood preset "{data.preset}", generate a consistent CSS filter for a batch of photos.\n\n'
            f"Return JSON: {_CONSISTENCY_SCHEMA}\n\n{_CONSISTENCY_RULES}"
        )
        result = _claude_text(prompt)
    else:
        prompt = (
            f'Style description: "{data.preset}"\n\n'
            f"Generate a consistent CSS filter for a batch of photos.\n\n"
            f"Return JSON: {_CONSISTENCY_SCHEMA}\n\n{_CONSISTENCY_RULES}"
        )
        result = _claude_text(prompt)

    if result and result.get("baseFilter"):
        base_filter = result["baseFilter"]
        style_name = result.get("styleName", "consistent style")
        summary = result.get("summary", f"{len(data.images)} photos adjusted into a consistent look.")

    # Fallback filter
    if not base_filter:
        p = data.preset.lower().strip()
        if "warm" in p or "cinematic" in p:
            base_filter = "brightness(1.12) contrast(1.18) saturate(1.22) sepia(0.12)"
            style_name = "warm cinematic consistency"
        elif "clean" in p or "bright" in p:
            base_filter = "brightness(1.22) contrast(1.05) saturate(1.02)"
            style_name = "clean daylight consistency"
        elif "moody" in p or "film" in p:
            base_filter = "brightness(0.92) contrast(1.3) saturate(0.82)"
            style_name = "moody film consistency"
        else:
            base_filter = "brightness(1.05) contrast(1.08) saturate(1.05)"
            style_name = "balanced consistency"
        summary = f"{len(data.images)} photos were adjusted into one visually consistent set."

    edited_images = [
        {
            "image": image,
            "filter": base_filter,
            "adjustmentReason": "Adjusted individually to match the lighting and tone of the full photo set.",
        }
        for image in data.images
    ]

    return {
        "preset": data.preset,
        "styleName": style_name,
        "summary": summary,
        "editedImages": edited_images,
        "status": "consistent style applied",
    }


# =========================
# TASK 3 — PERSONAL STYLE
# =========================

class PersonalStyleRequest(BaseModel):
    image_name: str


@app.post("/personal-style")
def personal_style(data: PersonalStyleRequest):
    presets = load_presets()

    if presets and _claude:
        preset_summary = json.dumps(
            [{"mood": p.get("mood"), "styleName": p.get("styleName"), "tags": p.get("tags", [])} for p in presets],
            ensure_ascii=False,
        )
        prompt = (
            f"Based on these saved mood presets from the user:\n{preset_summary}\n\n"
            "Analyze the user's style preferences and suggest a personal photo editing style.\n\n"
            'Return JSON:\n'
            '{"suggestedStyle":"style name","traits":["trait1","trait2","trait3"],"reason":"one sentence","suggestedEdit":{"label":"...","filter":"brightness(1.08) contrast(1.05) saturate(1.1)","explanation":"one sentence"}}\n\n'
            "Return ONLY valid JSON."
        )
        try:
            msg = _claude.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=512,
                messages=[{"role": "user", "content": prompt}],
            )
            result = json.loads(msg.content[0].text)
            return {
                "image": data.image_name,
                "suggestedStyle": result.get("suggestedStyle", "personalized style"),
                "traits": result.get("traits", []),
                "basedOn": len(presets),
                "reason": result.get("reason", ""),
                "suggestedEdit": result.get("suggestedEdit", {
                    "label": "personalized",
                    "filter": "brightness(1.08) contrast(1.08) saturate(1.1) sepia(0.08)",
                    "explanation": "Based on your style preferences.",
                }),
            }
        except Exception:
            pass

    # Fallback
    if presets:
        all_tags = []
        for preset in presets:
            all_tags.extend(preset.get("tags", []))
        tag_counts: dict[str, int] = {}
        for tag in all_tags:
            tag_counts[tag] = tag_counts.get(tag, 0) + 1
        preferred_tags = sorted(tag_counts, key=lambda t: tag_counts[t], reverse=True)[:3]
        suggested_style = presets[-1].get("styleName", "personalized style")
        based_on = len(presets)
        reason = "Generated from saved mood presets and repeated style preferences."
    else:
        preferred_tags = ["warm tones", "soft contrast", "natural lighting"]
        suggested_style = "soft cinematic"
        based_on = 0
        reason = "Default suggestion used because no saved presets are available yet."

    return {
        "image": data.image_name,
        "suggestedStyle": suggested_style,
        "traits": preferred_tags,
        "basedOn": based_on,
        "reason": reason,
        "suggestedEdit": {
            "label": suggested_style,
            "filter": "brightness(1.08) contrast(1.08) saturate(1.1) sepia(0.08)",
            "explanation": "This edit reflects the user's recent style preferences.",
        },
    }
