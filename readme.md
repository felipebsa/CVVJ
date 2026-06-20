# C.V.V.J — Collection of Vintage Vehicles Jundiaí

A full-stack system for managing vintage vehicles and their services. Built with FastAPI + SQLAlchemy 2.0 on the backend and vanilla JavaScript on the frontend.

---

## About

C.V.V.J is a system built to organize and manage a collection of vintage vehicles (black plate) from a workshop in Jundiaí, SP. The system allows registering vehicles, uploading photos, tracking active status, and managing services performed on each one.

---

## Project Structure

```
cvvj/
├── backend/
│   ├── models/
│   │   ├── vehicle.py
│   │   ├── services.py
│   │   └── vehicle_images.py
│   ├── schemas/
│   │   ├── vehicle.py
│   │   ├── services.py
│   │   └── vehicle_images.py
│   ├── routes/
│   │   ├── vehicle.py
│   │   ├── services.py
│   │   └── vehicle_images.py
│   ├── uploads/
│   ├── database.py
│   └── main.py
├── frontend/
│   ├── css/
│   │   └── global.css
│   ├── js/
│   │   └── script.js
│   ├── index.html
│   ├── central.html
│   ├── servicos.html
│   └── status.html
├── .gitignore
├── README.md
└── requirements.txt
```

---

## Installation

**Requirements:** Python 3.8+

```bash
# Clone the repository
git clone https://github.com/felipebsa/cvvj.git
cd cvvj/backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Run the server
python -m uvicorn main:app --reload
```

Access the API at: **http://localhost:8000**  
Interactive docs at: **http://localhost:8000/docs**  
Frontend: open `frontend/index.html` with Live Server on port **5500**

---

## API Endpoints

### Vehicles

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/vehicles/all/` | List all vehicles |
| GET | `/vehicles/id/{id}` | Get vehicle by ID |
| GET | `/vehicles/actives/{active}` | List vehicles by active status |
| POST | `/vehicles/register` | Register a new vehicle |
| PUT | `/vehicles/{id}` | Update vehicle data |
| PATCH | `/vehicles/{id}` | Toggle vehicle active status |
| DELETE | `/vehicles/{id}` | Delete a vehicle |

### Services

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/services` | List all services |
| GET | `/services/id/{id}` | Get service by ID |
| GET | `/services/finish/{finish}` | List services by finish status |
| GET | `/services/vehicle/{id}` | List services by vehicle |
| POST | `/services/register` | Register a new service |
| PUT | `/services/update/{id}` | Update service data |
| PATCH | `/services/{id}` | Toggle service finish status |
| DELETE | `/services/delete/{id}` | Delete a service |

### Vehicle Images

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/vehicle_images/id/{id}` | Get image by ID |
| GET | `/vehicle_images/vehicle/{id}` | List images by vehicle |
| POST | `/vehicle_images/upload/{vehicle_id}` | Upload image file |
| DELETE | `/vehicle_images/delete/{id}` | Delete an image |

---

## Data Models

### Vehicle

| Field | Type | Description |
|-------|------|-------------|
| vehicle_id | int | Primary key |
| model | str | Vehicle model |
| kind | str | Vehicle type |
| date | str | Manufacturing year |
| plate | str | License plate |
| active | bool | Active status (default: true) |

### Service

| Field | Type | Description |
|-------|------|-------------|
| service_id | int | Primary key |
| vehicle_id | int | Foreign key → vehicles |
| title | str | Service title |
| desc | str | Service description |
| date | str | Service date |
| labor_value | float | Labor cost (optional) |
| parts_value | float | Parts cost (optional) |
| parts_desc | str | Parts description (optional) |
| finish | bool | Completion status (default: false) |

### Vehicle Image

| Field | Type | Description |
|-------|------|-------------|
| image_id | int | Primary key |
| vehicle_id | int | Foreign key → vehicles |
| image_path | str | Path to image file on disk |

---

## Tech Stack

**Backend**
- [Python 3](https://python.org)
- [FastAPI](https://fastapi.tiangolo.com)
- [SQLAlchemy 2.0](https://sqlalchemy.org)
- [Pydantic](https://docs.pydantic.dev)
- [SQLite](https://sqlite.org)
- [Uvicorn](https://www.uvicorn.org)

**Frontend**
- HTML5 / CSS3
- Vanilla JavaScript (Fetch API)
- [Tabler Icons](https://tabler.io/icons)

---

## Status

✅ Backend complete  
✅ Frontend complete