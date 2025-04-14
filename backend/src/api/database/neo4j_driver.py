# internal
from src.globals.environment import Environment

# external
from neo4j import AsyncGraphDatabase
from dotenv import load_dotenv

class Neo4jDriver:
    def __init__(self):

        load_dotenv()
        environment = Environment()

        self.uri = environment.NEO4J_URI
        self.user = environment.NEO4J_USER
        self.password = environment.NEO4J_PASSWORD
        # self.driver = AsyncGraphDatabase.driver(self.uri, auth=(self.user, self.password))

    async def close(self):
        await self.driver.close()

    async def save_node(self, node_type: str, properties: dict) -> str:
        query = f"""
        CREATE (n:{node_type} $props)
        RETURN id(n) as node_id
        """
        async with self.driver.session() as session:
            result = await session.run(query, props=properties)
            record = await result.single()
            return record["node_id"]

    async def create_relationship(self, parent_id: str, child_id: str, rel_type: str = "DERIVED_FROM"):
        query = """
        MATCH (a), (b)
        WHERE id(a) = $parent_id AND id(b) = $child_id
        CREATE (b)-[r:%s]->(a)
        RETURN type(r)
        """ % rel_type
        async with self.driver.session() as session:
            await session.run(query, parent_id=int(parent_id), child_id=int(child_id))
