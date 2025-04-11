# internal
from src.api.workflows.username.search_platforms import search_username

async def username_workflow_start(data: str):

    username_occurances = search_username(data)
    
    return username_occurances