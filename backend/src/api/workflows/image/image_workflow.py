# builtin
from typing import List

# internal
from src.api.workflows.image.face_search import detect_faces, facecheck_search
from src.api.workflows.image.metadata_extractor import extract_metadata
from src.api.workflows.image.reverse_search import reverse_image_search_serpapi
from src.api.workflows.image.text_read import extract_text

async def image_workflow_start(data: str):
    metadata = await extract_metadata(data)
    faces = await detect_faces(data)
    face_matches = await facecheck_search(face)
    text = await extract_text(data)
    reverse_search_results = await reverse_image_search_serpapi(data)

    return metadata + face_matches + text + reverse_search_results