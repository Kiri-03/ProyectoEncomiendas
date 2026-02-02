from fastapi import Header, HTTPException

async def verify_gateway_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    return authorization