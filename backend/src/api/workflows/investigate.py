# builtin

# internal
from src.api.models.data_models import NodeType
from src.api.models.communication_models import userInput, classifiedOutput
from src.api.agents.classifier import classify_data
from src.api.workflows.workflow_manager import run_workflow
from src.api.database.neo4j_driver import Neo4jDriver

# external

MAX_DEPTH = 5
neo4j_driver = Neo4jDriver

async def investigate(data: str, parent_id: str, parent_type: NodeType, depth: int):
    
    if depth > MAX_DEPTH:
        return {"message" : "Max depth reached"}

    formatted_input: userInput = userInput(input = data)
    classified_data: classifiedOutput = await classify_data(formatted_input)
    data_type: NodeType = classified_data.data_type

    node_properties = {
        "value": data,
        "type": data_type
    }

    node_id = await neo4j_driver.save_node(data_type.value.upper(), node_properties)

    if parent_id is not None:
        await neo4j_driver.create_relationship(parent_id, node_id)


    results = await run_workflow(data, data_type)

    for result in results:
        await investigate(result, node_id, data_type, depth + 1)

    return {"message": "Investigation complete"}