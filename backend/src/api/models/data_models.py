# built in
from typing import List, Optional

# external
from pydantic import BaseModel

# internal
from enum import Enum
from pydantic import BaseModel, HttpUrl, IPvAnyAddress


class NodeType(str, Enum):
    PHONE_NUMBER = "phone number"
    EMAIL_ADDRESS = "email address"
    USER_NAME = "user name"
    SOCIAL_MEDIA_ACCOUNT = "social media account"
    ACCOUNT_GENERIC = "generic account"
    PHYSICAL_ADRESS = "physical address"
    COORDINATES = "coordinates"
    PERSON = "person"
    BUSINESS = "business"
    DOMAIN_NAME = "domain name"
    WEB_ADDRESS = "web address"
    IP_ADDRESS = "ip address"
    IMAGE = "image"
    VIDEO = "video"
    CYPRO_WALLET = "crypto wallet"
    CYPRO_TRANSACTION = "crypto transaction"
    DATA_BREACH = "data breach"
    PASSWORD = "password"
    MISC = "miscellaneous"


class PhoneNumber(BaseModel):
    id: int
    parent_id: int
    number: str
    description: str
    type: NodeType = NodeType.PHONE_NUMBER

class EmailAddress(BaseModel):
    id: int
    parent_id: int
    email: str
    description: str
    type: NodeType = NodeType.EMAIL_ADDRESS

class UserName(BaseModel):
    id: int
    parent_id: int
    username: str
    description: str
    type: NodeType = NodeType.USER_NAME

class SocialMediaAccount(BaseModel):
    id: int
    parent_id: int
    handle: str
    platform: Optional[str] = None
    description: str
    type: NodeType = NodeType.SOCIAL_MEDIA_ACCOUNT

class GenericAccount(BaseModel):
    id: int
    parent_id: int
    account: str
    description: str
    type: NodeType = NodeType.ACCOUNT_GENERIC

class PhysicalAddress(BaseModel):
    id: int
    parent_id: int
    address: str
    description: str
    type: NodeType = NodeType.PHYSICAL_ADRESS

class Coordinates(BaseModel):
    id: int
    parent_id: int
    latitude: float
    longitude: float
    description: str
    type: NodeType = NodeType.COORDINATES

class Person(BaseModel):
    id: int
    parent_id: int
    name: str
    description: str
    type: NodeType = NodeType.PERSON

class Business(BaseModel):
    id: int
    parent_id: int
    name: str
    description: str
    type: NodeType = NodeType.BUSINESS

class DomainName(BaseModel):
    id: int
    parent_id: int
    domain: str
    description: str
    type: NodeType = NodeType.DOMAIN_NAME

class WebAddress(BaseModel):
    id: int
    parent_id: int
    url: HttpUrl
    description: str
    type: NodeType = NodeType.WEB_ADDRESS

class IPAddress(BaseModel):
    id: int
    parent_id: int
    ip: IPvAnyAddress
    description: str
    type: NodeType = NodeType.IP_ADDRESS

class Image(BaseModel):
    id: int
    parent_id: int
    data: str
    description: str
    type: NodeType = NodeType.IMAGE

class Video(BaseModel):
    id: int
    parent_id: int
    data: str
    description: str
    type: NodeType = NodeType.VIDEO

class CryptoWallet(BaseModel):
    id: int
    parent_id: int
    wallet_address: str
    description: str
    type: NodeType = NodeType.CYPRO_WALLET

class CryptoTransaction(BaseModel):
    id: int
    parent_id: int
    transaction_id: str
    description: str
    type: NodeType = NodeType.CYPRO_TRANSACTION

class DataBreach(BaseModel):
    id: int
    parent_id: int
    breach_name: str
    description: Optional[str] = None
    description: str
    type: NodeType = NodeType.DATA_BREACH

class Password(BaseModel):
    id: int
    parent_id: int
    password: str
    description: str
    type: NodeType = NodeType.PASSWORD

class Miscellaneous(BaseModel):
    id: int
    parent_id: int
    content: str
    description: str
    type: NodeType = NodeType.MISC
