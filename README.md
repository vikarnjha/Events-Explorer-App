# Events Explorer

A modern event discovery platform that allows users to search and explore live events using the Ticketmaster Discovery API.

## Features

* Search events by city or keyword
* Browse trending events on initial page load
* Category-based filtering
* Event cards with image, venue, date, and category
* Pagination support
* Loading skeletons
* Error handling
* Responsive design
* FastAPI backend
* React frontend

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios

### Backend

* FastAPI
* HTTPX
* Python Dotenv
* Uvicorn

### External API

* Ticketmaster Discovery API

---

## Project Structure

```txt
events-explorer/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── .env
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── config.py
│   │   └── main.py
│   │
│   ├── .env
│   ├── .env.example
│   └── pyproject.toml
│
└── README.md
```

---

## API Endpoint

### Search Events

```http
GET /api/events
```

### Query Parameters

| Parameter | Type    | Required | Description               |
| --------- | ------- | -------- | ------------------------- |
| city      | string  | Yes      | City or keyword to search |
| page      | integer | No       | Pagination page number    |

### Example Request

```http
GET /api/events?city=music&page=0
```

### Sample Response

```json
{
  "events": [
    {
      "id": "123",
      "title": "Music Festival",
      "date": "2026-08-20",
      "venue": "Arena",
      "image": "https://...",
      "category": "Music",
      "url": "https://ticketmaster.com/..."
    }
  ],
  "page": 0,
  "totalPages": 10
}
```

---

# Backend Setup

## Navigate to Backend

```bash
cd backend
```

## Install Dependencies

Using UV:

```bash
uv sync
```

## Create Environment Variables

Create a `.env` file:

```env
TICKETMASTER_API_KEY=your_ticketmaster_api_key
```

## Run Backend

```bash
uv run uvicorn app.main:app --reload
```

Backend runs at:

```txt
http://localhost:8000
```

### Swagger Documentation

```txt
http://localhost:8000/docs
```

---

# Frontend Setup

## Navigate to Frontend

```bash
cd frontend
```

## Install Dependencies

```bash
npm install
```

## Create Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000/api/events
```

## Run Frontend

```bash
npm run dev
```

Frontend runs at:

```txt
http://localhost:5173
```

---

# Production Deployment

## Backend Deployment (Render)

Required Environment Variables:

```env
TICKETMASTER_API_KEY=your_ticketmaster_api_key
```

### Start Command

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

## Frontend Deployment (Vercel)

Production Environment Variable:

```env
VITE_API_URL=https://your-render-api.onrender.com/api/events
```

---

## Environment Variables

### Backend

```env
TICKETMASTER_API_KEY=
```

### Frontend

```env
VITE_API_URL=
```

---

## Future Improvements

* Event Details Page
* Saved Events
* User Authentication
* Location-Based Recommendations
* Advanced Filtering
* Event Bookmarking
* Event Sharing
* Personalized Event Suggestions

---

## Author

**Vikarn Kumar Jha**

GitHub: https://github.com/vikarnjha

LinkedIn: https://linkedin.com/in/vikarnjha
