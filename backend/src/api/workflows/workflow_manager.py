# builtin
from typing import List

# internal
from src.api.models.data_models import NodeType
from src.api.workflows.username.username_workflow import username_workflow_start
from src.api.workflows.image.image_workflow import image_workflow_start

# external

async def run_workflow(data: str, data_type: NodeType) -> List[str]:

    print(data_type)

    if data_type == NodeType.IMAGE:
        return await image_workflow_start(data)

    elif data_type == NodeType.MISC:
        return await username_workflow_start(data)
    elif data_type == NodeType.USER_NAME:
        return await username_workflow_start(data)

    else:
        return []