from fastapi import APIRouter
import httpx

router = APIRouter(prefix="/api/health", tags=["Health"])

PROJECTS = [
    {"id": "gridsense",  "name": "GridSense",  "url": "https://gridsense-eight.vercel.app"},
    {"id": "cropsense",  "name": "CropSense",  "url": "https://cropsense-39bz.onrender.com"},
]

@router.get("/projects")
async def check():
    results = []
    async with httpx.AsyncClient(timeout=5.0) as client:
        for p in PROJECTS:
            try:
                r = await client.get(p["url"])
                results.append({"id": p["id"], "name": p["name"],
                    "status": "online" if r.status_code < 400 else "degraded"})
            except:
                results.append({"id": p["id"], "name": p["name"], "status": "offline"})
    return {"projects": results}
