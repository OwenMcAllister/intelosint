# internal
from src.api.external_db_helpers.thatsthem_client import search_by_phone


async def format_phone_number(phone) -> str:

    digits = re.sub(r'\D', '', phone)
    
    if len(digits) == 11 and digits[0] == '1':
        digits = digits[1:]
    
    if len(digits) != 10:
        raise ValueError("Phone number must have 10 digits after cleaning.")
    
    return f"{digits[:3]}-{digits[3:6]}-{digits[6:]}"



async def phonenumber_workflow_start(data: str):
    phone_number = await format_phone_number(data)
    phone_info = await search_by_phone(data)
