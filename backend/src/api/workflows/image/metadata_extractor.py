# builtin
from typing import List, Dict
import requests
import tempfile

# internal

# external
import exifread


async def extract_metadata(image_url: str) -> List[str]:

    metadata: List[str] = []

    try:
        response = requests.get(image_url, timeout=10)
        response.raise_for_status()

        with tempfile.NamedTemporaryFile(delete=True) as tmp_file:
            tmp_file.write(response.content)
            tmp_file.flush()

            with open(tmp_file.name, 'rb') as file:
                tags: Dict = exifread.process_file(file)
            
        for tag in tags.keys():
            metadata.append(f"{tag}: {tags[tag]}")

        if metadata:
            return metadata
        else:
            return ["No metadata found"]

    except Exception as e:
        return [f"Metadata extraction error: {e}"]