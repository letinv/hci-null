from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#task 1

class MoodEditRequest(BaseModel):
    mood: str
    image_name: str

@app.post("/mood-edit")
def mood_edit(data: MoodEditRequest):
    return {
        "originalImage": data.image_name,
        "mood": data.mood,
        "generatedResults": [
            "warm_edit_1.jpg",
            "warm_edit_2.jpg",
            "warm_edit_3.jpg"
        ]
    }


#task 2

class ConsistencyRequest(BaseModel):
    images: list[str]
    preset: str


@app.post("/consistency-edit")
def consistency_edit(data: ConsistencyRequest):
    return {
        "preset": data.preset,
        "editedImages": data.images,
        "status": "consistent style applied"
    }


#task 3

class PersonalStyleRequest(BaseModel):
    image_name: str

@app.post("/personal-style")
def personal_style(data: PersonalStyleRequest):
    return {
        "image": data.image_name,
        "suggestedStyle": "soft cinematic",
        "traits": [
            "warm tones",
            "soft contrast",
            "natural lighting"
        ]
    }