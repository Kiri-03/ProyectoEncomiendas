from pydantic import BaseModel

class GatewayResponse(BaseModel):
    status: str
    message: str