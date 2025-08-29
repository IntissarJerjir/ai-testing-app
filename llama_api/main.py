# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from inference_api import generate_gherkin  

app = FastAPI()

class UserStoryRequest(BaseModel):
    user_story: str

@app.post("/generate-gherkin/")
async def generate_gherkin_endpoint(request: UserStoryRequest):
    gherkin = generate_gherkin(request.user_story)  
    return {"gherkin": gherkin}
