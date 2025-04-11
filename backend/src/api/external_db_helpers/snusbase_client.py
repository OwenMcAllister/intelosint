# builtin
import json
import requests

# internal
from src.globals.environment import Environment

# external
import httpx
import os
from dotenv import load_dotenv

load_dotenv()
environment = Environment()

snusbase_auth = environment.SNUSBASE_API_KEY
snusbase_api = "https://api.snusbase.com/v3/"  # Update if needed

async def send_request(url: str, body: dict = None):
    headers = {
        'Auth': snusbase_auth,
        'Content-Type': 'application/json',
    }
    method = 'POST' if body else 'GET'
    full_url = snusbase_api + url

    async with httpx.AsyncClient(timeout=30) as client:
        if method == 'POST':
            response = await client.post(full_url, headers=headers, json=body)
        else:
            response = await client.get(full_url, headers=headers)

    response.raise_for_status()
    return response.json()


async def search_breaches(data: str, data_type: str) -> list[str]:
    search_response = await send_request('data/search', {
        'terms': [data],
        'types': [data_type],
        'wildcard': False,
    })

    breaches = []

    if "results" in search_response:
        for result in search_response["results"]:
            email = result.get("email", "")
            username = result.get("username", "")
            password = result.get("password", "")

            if email:
                breaches.append(f"Email: {email}")
            if username:
                breaches.append(f"Username: {username}")
            if password:
                breaches.append(f"Password: {password}")

    return breaches
