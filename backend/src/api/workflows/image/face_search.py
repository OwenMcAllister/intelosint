# builtin
import requests
import tempfile
import base64
import io
import os
import time
import httpx
import asyncio
from typing import List, Dict, Optional

# internal
from src.globals.environment import Environment

# external
from pillow import Image
from dotenv import load_dotenv


async def detect_faces(image_url: str) -> List[str]:

    results = []

    try:
        response = requests.get(image_url, timeout = 10)
        response.raise_for_status()

        with tempfile.NamedTemporaryFile(suffix='.jpg', delete = True) as tmp_file:
            tmp_file.write(response.content)
            tmp_file.flush()

            image = face_recognition.load_image_file(tmp_file.name)
            face_locations = face_recognition.face_locations(image)

        if not face_locations:
            return ["No faces found in image"]

        pillow_image = Image.open(tmp_file.name)

        for i, (top, right, bottom, left) in enumerate(face_locations):
            cropped_face = pillow_image.crop((left, top, right, bottom))
            buffered = io.BytesIO()
            cropped_face.save(buffered, format="JPEG")

            face_b64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

            results.append(face_base64)

        return results
    
    except Exception as e:
        return [f"Error detecting faces: {e}"]


async def facecheck_search(images: List[str]) -> Optional[List[Dict]]:
    
    TESTING_MODE = True

    load_dotenv()
    environment = Environment()

    api_token = environment.FACECHECK_API_KEY
    site = 'https://facecheck.id'
    headers = {
        'accept': 'application/json',
        'Authorization': api_token
    }

    try:

        image_bytes = base64.b64decode(image_base64)

        files = {'images': ('face.jpg', image_bytes, 'image/jpeg')}

        async with httpx.AsyncClient(timeout=30) as client:
            upload_response = await client.post(site + '/api/upload_pic', headers=headers, files=files)
            upload_data = upload_response.json()

        if upload_data.get('error'):
            return [{"error": f"{upload_data['error']} ({upload_data['code']})"}]

        id_search = upload_data.get('id_search')

        if not id_search:
            return [{"error": "No id_search returned from upload"}]

        print(upload_data['message'] + ' id_search=' + id_search)

        json_data = {
            'id_search': id_search,
            'with_progress': True,
            'status_only': False,
            'demo': TESTING_MODE
        }

        while True:
            async with httpx.AsyncClient(timeout=30) as client:
                search_response = await client.post(site + '/api/search', headers=headers, json=json_data)
                search_data = search_response.json()

            if search_data.get('error'):
                return [{"error": f"{search_data['error']} ({search_data['code']})"}]

            if search_data.get('output'):
                return search_data['output']['items']

            print(f'{search_data["message"]} progress: {search_data["progress"]}%')
            await asyncio.sleep(1)

    except Exception as e:
        return [{"error": f"FaceCheck Search Exception: {e}"}]