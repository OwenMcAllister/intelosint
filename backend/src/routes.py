# built in
from uuid import uuid4

# internal
from src.api.models.communication_models import userInput
from src.api.agents.classifier import classify_data
from src.api.workflows.investigate import investigate
from src.api.models.response_types import NodeResponse, NodeInfo, Nodes

# external
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import random

MAX_NEWNODES: int = 6

def setup_routes(app: FastAPI):

    @app.post("/classify")
    async def classify(input: userInput):
        result = await classify_data(input)
        return result

    @app.post("/investigate/")
    async def start_investigation(input: userInput):
        return await investigate(input.input, None, None, 0)
    
def setup_websocket(app: FastAPI):
     
    @app.websocket("/ws/node")
    async def node_endpoint(websocket: WebSocket):
        await websocket.accept()

        try:
            while True:
                await websocket.receive_json()

                await websocket.send("Nothing yet")
        except WebSocketDisconnect:
            print("Websocket connection closed")

    @app.websocket("/ws/node/test")
    async def test_endpoint(websocket: WebSocket):
        await websocket.accept()

        try:
            while True:
                response = await websocket.receive_json()
                print(response)
                
                parentId: str = response["id"]
                parentIndex: int = response["index"]
                
                nodes: list[NodeResponse] = []

                num_nodes = random.randint(0, MAX_NEWNODES)

                for i in range(num_nodes):
                    info: NodeInfo = NodeInfo(description=f"Test node {i}")
                    testNode: NodeResponse = NodeResponse(id=str(uuid4()), name="What?", info=info)
                    nodes.append(testNode)

                children: Nodes = Nodes(parentId=parentId, parentIndex=parentIndex, nodes=nodes)

                await websocket.send_json(children.model_dump())
        except WebSocketDisconnect:
            print("Websocket connection closed")
