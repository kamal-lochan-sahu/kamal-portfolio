import asyncio
import logging
import os
import re
import smtplib
from email.message import EmailMessage

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/contact", tags=["Contact"])
limiter = Limiter(key_func=get_remote_address)

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class BriefRequest(BaseModel):
    name: str
    email: str
    message: str
    website: str = ""  # honeypot: real users leave this empty


def _send(req: BriefRequest) -> bool:
    host = os.getenv("SMTP_HOST")
    user = os.getenv("SMTP_USER")
    password = os.getenv("SMTP_PASS")
    to = os.getenv("CONTACT_TO", user or "")
    if not (host and user and password and to):
        return False
    msg = EmailMessage()
    msg["Subject"] = f"Portfolio brief from {req.name[:60]}"
    msg["From"] = user
    msg["To"] = to
    msg["Reply-To"] = req.email
    msg.set_content(f"Name: {req.name}\nEmail: {req.email}\n\n{req.message}")
    with smtplib.SMTP(host, int(os.getenv("SMTP_PORT", "587")), timeout=15) as s:
        s.starttls()
        s.login(user, password)
        s.send_message(msg)
    return True


@router.post("/")
@limiter.limit("3/minute")
async def contact(request: Request, req: BriefRequest):
    if req.website:  # bot: pretend success, send nothing
        return {"ok": True}
    name, message = req.name.strip(), req.message.strip()
    if not name or len(name) > 100:
        raise HTTPException(400, "Please enter your name")
    if not EMAIL_RE.match(req.email.strip()) or len(req.email) > 200:
        raise HTTPException(400, "Please enter a valid email")
    if len(message) < 10 or len(message) > 2000:
        raise HTTPException(400, "Message must be 10-2000 characters")
    try:
        sent = await asyncio.to_thread(_send, req)
    except Exception:
        logger.exception("Contact email failed")
        raise HTTPException(502, "Could not send right now")
    if not sent:
        raise HTTPException(503, "Contact form not configured")
    return {"ok": True}
