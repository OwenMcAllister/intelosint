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
    
    user_prompt = input
    
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
        
        return response
        
    except (ValidationError, Exception) as e:
        raise e