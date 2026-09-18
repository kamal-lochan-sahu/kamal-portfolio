import os
import time
import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/github", tags=["github"])

USERNAME = "kamal-lochan-sahu"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

CACHE_TTL_SECONDS = 600  # 10 minutes — GitHub stats don't change fast enough to need live hits
_cache: dict = {"data": None, "expires_at": 0.0}


def _headers():
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "kamal-portfolio-backend",
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    return headers


@router.get("/stats")
async def github_stats():
    """Returns user profile + recent repos. Uses GITHUB_TOKEN if set
    (higher rate limit, accurate follower count); falls back to
    unauthenticated calls otherwise. Cached in-memory for
    CACHE_TTL_SECONDS to avoid hitting GitHub on every page load."""
    now = time.time()
    if _cache["data"] is not None and now < _cache["expires_at"]:
        return _cache["data"]

    async with httpx.AsyncClient(timeout=10) as client:
        try:
            user_res = await client.get(
                f"https://api.github.com/users/{USERNAME}", headers=_headers()
            )
            repos_res = await client.get(
                f"https://api.github.com/users/{USERNAME}/repos"
                "?sort=updated&per_page=6",
                headers=_headers(),
            )
        except httpx.HTTPError as e:
            # If a request fails but we have a stale cache, serve it rather
            # than erroring out the whole GitHub section.
            if _cache["data"] is not None:
                return _cache["data"]
            raise HTTPException(status_code=502, detail=str(e))

    if user_res.status_code != 200:
        if _cache["data"] is not None:
            return _cache["data"]
        raise HTTPException(status_code=user_res.status_code, detail="GitHub user fetch failed")

    user = user_res.json()
    repos = repos_res.json() if repos_res.status_code == 200 else []

    result = {
        "user": {
            "public_repos": user.get("public_repos", 0),
            "followers": user.get("followers", 0),
            "following": user.get("following", 0),
            "created_at": user.get("created_at"),
        },
        "repos": [
            {
                "name": r.get("name"),
                "description": r.get("description"),
                "stargazers_count": r.get("stargazers_count", 0),
                "language": r.get("language"),
                "html_url": r.get("html_url"),
                "updated_at": r.get("updated_at"),
            }
            for r in (repos if isinstance(repos, list) else [])
        ],
    }

    _cache["data"] = result
    _cache["expires_at"] = now + CACHE_TTL_SECONDS
    return result
