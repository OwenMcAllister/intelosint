# internal
from src.api.models.data_models import NodeType

# external
from pydantic import BaseModel

class userInput(BaseModel):
    input: str

class classifiedOutput(BaseModel):
    type: NodeType