# builtin

# external
from pydantic import BaseModel

# internal

class NodeInfo(BaseModel):
    description: str

class NodeResponse(BaseModel):
    id: str
    name: str
    info: NodeInfo

class Nodes(BaseModel):
    parentId: str
    nodes: list[NodeResponse]
