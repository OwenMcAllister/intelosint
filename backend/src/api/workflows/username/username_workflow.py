# internal
from src.api.workflows.username.search_platforms import search_username
from src.api.external_db_helpers.snusbase_client import search_breaches


async def username_workflow_start(data: str):

    username_occurances = search_username(data)
    username_bread_data = search_breaches(data, "username")

    return username_occurances + username_bread_data