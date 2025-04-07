# built in

# internal
from src.api.models.communication_models import userInput
from src.api.agents.classifier import classify_data

# external
from fastapi import FastAPI, Depends

def setup_routes(app: FastAPI):
    @app.get("/test")
    async def test():
        return {"message": "Sanity Check"}

    @app.post("/classify")
    async def classify(input: userInput):
        result = await classify_data(input)
        return result