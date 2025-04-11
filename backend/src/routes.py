# built in

# internal
from src.api.models.communication_models import userInput
from src.api.agents.classifier import classify_data
from src.api.workflows.investigate import investigate

# external
from fastapi import FastAPI, Depends

def setup_routes(app: FastAPI):

    @app.post("/classify")
    async def classify(input: userInput):
        result = await classify_data(input)
        return result

    @app.post("/investigate/")
    async def start_investigation(input: userInput):
        return await investigate(input.input, None, None, 0)