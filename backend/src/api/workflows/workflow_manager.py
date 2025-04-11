# builtin

# internal
from src.api.workflows.handle_image.image_workflow import image_workflow_start

# external

async def run_workflow(data: str, data_type: NodeType) -> List[str]:

    if data_type == NodeType.IMAGE:
        return await image_workflow_start(data)