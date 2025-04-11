# built-in
from typing import List, Optional

# internal
from src.api.models.data_models import (
    NodeType,
    PhoneNumber,
    EmailAddress,
    UserName,
    SocialMediaAccount,
    GenericAccount,
    PhysicalAddress,
    Coordinates,
    Person,
    Business,
    DomainName,
    WebAddress,
    IPAddress,
    Image,
    Video,
    CryptoWallet,
    CryptoTransaction,
    DataBreach,
    Password,
    Miscellaneous,
)
from src.api.models.communication_models import userInput, classifiedOutput
from src.globals.environment import Environment

# external
from openai import AsyncOpenAI
from dotenv import load_dotenv
import json
from pydantic import ValidationError

load_dotenv()
environment = Environment()
client = AsyncOpenAI()
client.api_key = environment.OPENAI_API_KEY

async def classify_data(input: userInput) -> classifiedOutput:

    system_prompt = (
        "You are an OSINT classifier agent. Given an input, classify it appropriatly."
    )
    
    user_prompt = input.input
    
    try:
        response = await client.beta.chat.completions.parse(
            model="gpt-4o-mini-2024-07-18",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format=classifiedOutput,
            temperature=0,
        )
        
        structured_data = response.choices[0].message.content

        try:
            data = json.loads(structured_data)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to decode JSON: {e}")

        if 'data_type' not in data:
            raise ValueError("The key 'locations' is missing from the response data.")

        return classifiedOutput(data_type=NodeType(data['data_type']))

        
    except (ValidationError, Exception) as e:
        raise e


async def fit_data_to_object(data: str, data_type: NodeType, parent_id: int):

    data_object = create_data_object(data_type)

    



async def create_data_object(NodeType):

    switch = {
    NodeType.PHONE_NUMBER: PhoneNumber(
        id=0,
        parent_id=parent_id,
        number=data,
        description="",
    ),
    NodeType.EMAIL_ADDRESS: EmailAddress(
        id=0,
        parent_id=parent_id,
        email=data,
        description="",
    ),
    NodeType.USER_NAME: UserName(
        id=0,
        parent_id=parent_id,
        username=data,
        description="",
    ),
    NodeType.SOCIAL_MEDIA_ACCOUNT: SocialMediaAccount(
        id=0,
        parent_id=parent_id,
        handle=data,  # Platform can be parsed if needed
        description="",
    ),
    NodeType.ACCOUNT_GENERIC: GenericAccount(
        id=0,
        parent_id=parent_id,
        account=data,
        description="",
    ),
    NodeType.PHYSICAL_ADRESS: PhysicalAddress(
        id=0,
        parent_id=parent_id,
        address=data,
        description="",
    ),
    NodeType.COORDINATES: Coordinates(
        id=0,
        parent_id=parent_id,
        latitude=0.0,
        longitude=0.0,
        description="",
    ),
    NodeType.PERSON: Person(
        id=0,
        parent_id=parent_id,
        name=data,
        description="",
    ),
    NodeType.BUSINESS: Business(
        id=0,
        parent_id=parent_id,
        name=data,
        description="",
    ),
    NodeType.DOMAIN_NAME: DomainName(
        id=0,
        parent_id=parent_id,
        domain=data,
        description="",
    ),
    NodeType.WEB_ADDRESS: WebAddress(
        id=0,
        parent_id=parent_id,
        url=data,  # Should be a valid HttpUrl
        description="",
    ),
    NodeType.IP_ADDRESS: IPAddress(
        id=0,
        parent_id=parent_id,
        ip=data,  # Should be a valid IPvAnyAddress
        description="",
    ),
    NodeType.IMAGE: Image(
        id=0,
        parent_id=parent_id,
        data=data,  # Could store a base64 or URL reference
        description="",
    ),
    NodeType.VIDEO: Video(
        id=0,
        parent_id=parent_id,
        data=data,  # Could store a base64 or URL reference
        description="",
    ),
    NodeType.CYPRO_WALLET: CryptoWallet(
        id=0,
        parent_id=parent_id,
        wallet_address=data,
        description="",
    ),
    NodeType.CYPRO_TRANSACTION: CryptoTransaction(
        id=0,
        parent_id=parent_id,
        transaction_id=data,
        description="",
    ),
    NodeType.DATA_BREACH: DataBreach(
        id=0,
        parent_id=parent_id,
        breach_name=data,
        description="",
    ),
    NodeType.PASSWORD: Password(
        id=0,
        parent_id=parent_id,
        password=data,
        description="",
    ),
    NodeType.MISC: Miscellaneous(
        id=0,
        parent_id=parent_id,
        content=data,
        description="",
    ),
    }

    return switch.get(data_type, Miscellaneous(
        id=0,
        parent_id=parent_id,
        content=data,
        description="Unrecognized type defaulted to Miscellaneous."
    ))