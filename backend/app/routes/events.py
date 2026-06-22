from fastapi import APIRouter

from app.services.ticketmaster import search_events

router = APIRouter(
    prefix="/api/events",
    tags=["Events"]
)


@router.get("")
async def get_events(
    city: str,
    page: int = 0
):
    return await search_events(city, page)
