# builtin
from typing import List

# internal
from src.api.models.data_models import NodeType
from src.api.workflows.image.image_workflow import image_workflow_start

# external

async def run_workflow(data: str, data_type: NodeType) -> List[str]:

    if data_type == NodeType.IMAGE:
        return await image_workflow_start(data)