# builtin
import requests
from typing import List
import tempfile

# external
import easyocr

reader = easyocr.Reader(['en'], gpu=False)

async def extract_text(image_url: str) -> List[str]:
    try:
        response = requests.get(image_url, timeout = 10)
        response.raise_for_status()

        with tempfile.NamedTemporaryFile(suffix = '.jpg', delete = True) as tmp_file:
            tmp_file.write(response.content)
            tmp_file.flush()

            results = reader.readtext(tmp_file.name)

        if not results:
            return ["No text detected"]


        extraced_texts = [text for (_, text, _) in results]

        return extracted_texts

    except Exception as e:
        return [f"Error extracting text {e}"]