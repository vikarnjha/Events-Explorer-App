import httpx

from app.config import TICKETMASTER_API_KEY

BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json"


async def search_events(city: str, page: int = 0):

    params = {
        "apikey": TICKETMASTER_API_KEY,
        "keyword": city,
        "size": 12,
        "page": page
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(
            BASE_URL,
            params=params
        )

    response.raise_for_status()

    data = response.json()

    raw_events = (
        data.get("_embedded", {})
        .get("events", [])
    )

    events = []

    for event in raw_events:

        venue = (
            event.get("_embedded", {})
            .get("venues", [{}])[0]
            .get("name", "Unknown Venue")
        )

        image = ""

        if event.get("images"):
            image = event["images"][0]["url"]

        category = (
            event.get("classifications", [{}])[0]
            .get("segment", {})
            .get("name", "Other")
        )

        events.append({
            "id": event.get("id"),
            "title": event.get("name"),
            "date": event.get("dates", {})
                        .get("start", {})
                        .get("localDate"),
            "venue": venue,
            "image": image,
            "category": category,
            "url": event.get("url")
        })

    return {
        "events": events,
        "page": data.get("page", {}).get("number", 0),
        "totalPages": data.get("page", {}).get("totalPages", 1),
    }
