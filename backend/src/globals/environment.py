# external
from pydantic_settings import BaseSettings

class Environment(BaseSettings):
    OPENAI_API_KEY: str

    NEO4J_PASSWORD: str
    NEO4J_URI: str
    NEO4J_USER: str

    FACECHECK_API_KEY: str
    SERPAPI_API_KEY: str