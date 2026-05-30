from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import json
from pathlib import Path

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://hci-null.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# TASK 1 — MOOD EDIT
# =========================

class MoodEditRequest(BaseModel):
    mood: str
    image_name: str

@app.post("/mood-edit")
def mood_edit(data: MoodEditRequest):
    mood = data.mood.lower().strip()

    if "warm" in mood or "evening" in mood or "sunset" in mood:
        style_name = "warm evening"
        style_description = "A warm, soft-toned edit for a cozy evening atmosphere."
        options = [
            {
                "id": "A",
                "label": "warm cinematic",
                "filter": "brightness(1.15) contrast(1.12) saturate(1.35) sepia(0.18)",
                "tags": ["warm", "cinematic", "golden"],
                "explanation": "Adds warmer tones, stronger color depth, and a soft cinematic mood."
            },
            {
                "id": "B",
                "label": "golden soft",
                "filter": "brightness(1.22) contrast(1.02) saturate(1.25) sepia(0.28)",
                "tags": ["golden", "soft", "gentle"],
                "explanation": "Creates a lighter golden look with softer contrast and a calm mood."
            },
            {
                "id": "C",
                "label": "muted sunset",
                "filter": "brightness(0.98) contrast(1.18) saturate(1.05) sepia(0.25)",
                "tags": ["muted", "sunset", "soft contrast"],
                "explanation": "Keeps the image more muted while adding sunset-like warmth."
            }
        ]

    elif "clean" in mood or "bright" in mood or "fresh" in mood or "daylight" in mood:
        style_name = "clean daylight"
        style_description = "A bright and natural edit with a fresh, clean look."
        options = [
            {
                "id": "A",
                "label": "clean daylight",
                "filter": "brightness(1.22) contrast(1.08) saturate(1.05)",
                "tags": ["clean", "bright", "natural"],
                "explanation": "Brightens the image and keeps the colors natural and clear."
            },
            {
                "id": "B",
                "label": "fresh minimal",
                "filter": "brightness(1.28) contrast(0.96) saturate(0.92)",
                "tags": ["fresh", "minimal", "soft"],
                "explanation": "Creates a soft, minimal look with reduced contrast and lighter tones."
            },
            {
                "id": "C",
                "label": "clear contrast",
                "filter": "brightness(1.12) contrast(1.22) saturate(1.0)",
                "tags": ["clear", "crisp", "balanced"],
                "explanation": "Adds clarity and contrast while keeping the overall mood clean."
            }
        ]

    elif "cinematic" in mood or "film" in mood or "moody" in mood:
        style_name = "cinematic film"
        style_description = "A more dramatic edit inspired by film-like color grading."
        options = [
            {
                "id": "A",
                "label": "soft cinematic",
                "filter": "brightness(0.95) contrast(1.25) saturate(0.8)",
                "tags": ["cinematic", "soft", "dramatic"],
                "explanation": "Adds contrast and lowers saturation for a soft movie-like look."
            },
            {
                "id": "B",
                "label": "film contrast",
                "filter": "brightness(0.9) contrast(1.38) saturate(0.72) sepia(0.1)",
                "tags": ["film", "contrast", "muted"],
                "explanation": "Creates stronger shadows and muted tones for a film-inspired result."
            },
            {
                "id": "C",
                "label": "moody fade",
                "filter": "brightness(0.88) contrast(1.12) saturate(0.65) sepia(0.06)",
                "tags": ["moody", "faded", "low saturation"],
                "explanation": "Makes the photo calmer and moodier with faded colors."
            }
        ]

    elif "soft" in mood or "pastel" in mood or "dreamy" in mood:
        style_name = "soft pastel"
        style_description = "A gentle edit with low contrast and soft color tones."
        options = [
            {
                "id": "A",
                "label": "soft pastel",
                "filter": "brightness(1.18) contrast(0.88) saturate(0.9)",
                "tags": ["soft", "pastel", "gentle"],
                "explanation": "Reduces harsh contrast and creates a soft pastel-like mood."
            },
            {
                "id": "B",
                "label": "dreamy light",
                "filter": "brightness(1.25) contrast(0.82) saturate(0.82)",
                "tags": ["dreamy", "light", "airy"],
                "explanation": "Makes the image brighter and lighter with a dreamy atmosphere."
            },
            {
                "id": "C",
                "label": "soft natural",
                "filter": "brightness(1.12) contrast(0.92) saturate(0.95)",
                "tags": ["natural", "soft", "balanced"],
                "explanation": "Keeps the photo natural while softening the overall look."
            }
        ]

    else:
        style_name = "balanced natural"
        style_description = "A balanced edit for general mood descriptions."
        options = [
            {
                "id": "A",
                "label": "natural edit",
                "filter": "brightness(1.08) contrast(1.08) saturate(1.08)",
                "tags": ["natural", "balanced", "clear"],
                "explanation": "Improves brightness, contrast, and saturation in a balanced way."
            },
            {
                "id": "B",
                "label": "soft balanced",
                "filter": "brightness(1.08) contrast(0.95) saturate(0.92)",
                "tags": ["soft", "balanced", "calm"],
                "explanation": "Creates a softer version with lower contrast and calmer colors."
            },
            {
                "id": "C",
                "label": "crisp natural",
                "filter": "brightness(1.02) contrast(1.25) saturate(1.05)",
                "tags": ["crisp", "natural", "contrast"],
                "explanation": "Adds stronger contrast while keeping the image natural."
            }
        ]

    return {
        "originalImage": data.image_name,
        "mood": data.mood,
        "styleName": style_name,
        "styleDescription": style_description,
        "generatedResults": options
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
            "softness": data.softness
        }
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

    return {
        "status": "saved",
        "preset": preset
    }


def load_presets():
    if not PRESETS_FILE.exists():
        return []

    with open(PRESETS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


@app.get("/library")
def get_library():
    return {
        "presets": load_presets()
    }

@app.delete("/delete-preset/{preset_id}")
def delete_preset(preset_id: int):
    presets = load_presets()

    updated_presets = [
        preset for preset in presets
        if preset["id"] != preset_id
    ]

    with open(PRESETS_FILE, "w", encoding="utf-8") as f:
        json.dump(updated_presets, f, ensure_ascii=False, indent=2)

    return {
        "status": "deleted",
        "deletedPresetId": preset_id
    }


@app.get("/gallery")
def get_gallery():
    gallery_images = [
        {
            "id": i,
            "src": f"https://picsum.photos/seed/reph{i}/800/800"
        }
        for i in range(1, 13)
    ]

    return {
        "images": gallery_images
    }


# =========================
# TASK 2 — CONSISTENCY EDIT
# =========================

class ConsistencyRequest(BaseModel):
    images: list[str]
    preset: str

@app.post("/consistency-edit")
def consistency_edit(data: ConsistencyRequest):
    preset = data.preset.lower().strip()

    if "warm" in preset or "cinematic" in preset:
        base_filter = "brightness(1.12) contrast(1.18) saturate(1.22) sepia(0.12)"
        style_name = "warm cinematic consistency"

    elif "clean" in preset or "bright" in preset:
        base_filter = "brightness(1.22) contrast(1.05) saturate(1.02)"
        style_name = "clean daylight consistency"

    elif "moody" in preset or "film" in preset:
        base_filter = "brightness(0.92) contrast(1.3) saturate(0.82)"
        style_name = "moody film consistency"

    else:
        base_filter = "brightness(1.05) contrast(1.08) saturate(1.05)"
        style_name = "balanced consistency"

    edited_images = []

    for index, image in enumerate(data.images):
        brightness_offset = 1 + (index * 0.03)
        contrast_offset = 1 + (index * 0.02)

        adjusted_filter = (
            f"{base_filter} "
            f"brightness({brightness_offset:.2f}) "
            f"contrast({contrast_offset:.2f})"
        )

        edited_images.append({
            "image": image,
            "filter": adjusted_filter,
            "adjustmentReason": (
                "Adjusted individually to match the lighting and tone of the full photo set."
            )
        })

    return {
        "preset": data.preset,
        "styleName": style_name,
        "summary": (
            f"{len(data.images)} photos were adjusted into one visually consistent set."
        ),
        "editedImages": edited_images,
        "status": "consistent style applied"
    }

# =========================
# TASK 3 — PERSONAL STYLE
# =========================

class PersonalStyleRequest(BaseModel):
    image_name: str


@app.post("/personal-style")
def personal_style(data: PersonalStyleRequest):
    presets = load_presets()

    if presets:
        all_tags = []
        for preset in presets:
            all_tags.extend(preset.get("tags", []))

        tag_counts = {}
        for tag in all_tags:
            tag_counts[tag] = tag_counts.get(tag, 0) + 1

        preferred_tags = sorted(
            tag_counts,
            key=lambda tag: tag_counts.get(tag, 0),
            reverse=True
        )[:3]

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
            "explanation": "This edit reflects the user's recent style preferences and reduces repeated manual adjustment."
        }
    }