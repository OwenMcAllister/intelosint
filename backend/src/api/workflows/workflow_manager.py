# builtin
from typing import List

# internal
from src.api.models.data_models import NodeType
# from src.api.workflows.username.username_workflow import search_username
# from src.api.workflows.image.image_workflow import image_workflow_start
from typing import List

# external

async def run_workflow(data: str, data_type: NodeType) -> List[str]:

    print(data_type)

    if data_type == NodeType.IMAGE:
        # return await image_workflow_start(data)
        return []
    elif data_type == NodeType.MISC:
        # return await search_username(data)
        return []
    elif data_type == NodeType.USER_NAME:
        # return await search_username(data)
        return []
    else:
        return []
