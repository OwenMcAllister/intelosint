# built in

# internal

# external
from fastapi import FastAPI, Depends

def setup_routes(app: FastAPI):
    @app.get("/test")
    async def test():
        return {"message": "Sanity Check"}