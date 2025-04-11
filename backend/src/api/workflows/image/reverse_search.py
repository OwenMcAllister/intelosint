# internal
from src.globals.environment import Environment

# external
from serpapi import GoogleSearch
from dotenv import load_dotenv
import asyncio

load_dotenv()
environment = Environment()

async def reverse_image_search_serpapi(image_url: str):
    params = {
        "engine": "google_reverse_image",
        "image_url": image_url,
        "api_key": environment.SERPAPI_API_KEY
    }

    def run_search():
        search = GoogleSearch(params)
        return search.get_dict()

    results = await asyncio.to_thread(run_search)

    inline_images = results.get("inline_images", [])

    matches = []
    for image in inline_images:
        if "link" in image:
            matches.append(image["link"])

    return matches
