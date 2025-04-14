# builtin
from contextlib import asynccontextmanager

# external
from fastapi import FastAPI
from dotenv import load_dotenv

# internal
from src.routes import setup_routes, setup_websocket
from src.globals import Environment
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()


def setup_environment(app: FastAPI):
    environment = Environment()
    app.state.environment = environment


def setup_modules(app: FastAPI):
    setup_routes(app)
    setup_websocket(app)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up")
    setup_environment(app)
    setup_modules(app)
    yield
    print("Shutting down")


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development. Restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Sanity Check"}