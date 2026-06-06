# C.V.V.J — Collection of Vintage Vehicles Jundiaí

A backend system for managing vintage vehicles and their services. Built with FastAPI + SQLAlchemy 2.0.

---

## About

C.V.V.J is a REST API built to organize and manage a collection of vintage vehicles (black plate) from a workshop in Jundiaí, SP. The system allows registering vehicles, tracking their active status, and managing services performed on each one.

---

## Project Structure

```
cvvj/
├── backend/
│   ├── models/
│   │   ├── vehicle.py
│   │   └── services.py
│   ├── schemas/
│   │   ├── vehicle.py
│   │   └── services.py
│   ├── routes/
│   │   ├── vehicle.py
│   │   └── services.py
│   ├── database.py
│   └── main.py
├── frontend/
│   ├── css/
│   ├── js/
│   └── index.html
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

---

## API Endpoints

### Vehicles

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/vehicles/id/{id}` | Get vehicle by ID |
| GET | `/vehicles/actives/{active}` | List vehicles by active status |
| POST | `/vehicles/register` | Register a new vehicle |
| PUT | `/vehicles/{id}` | Update vehicle data |
| PATCH | `/vehicles/{id}` | Toggle vehicle active status |
| DELETE | `/vehicles/{id}` | Delete a vehicle |

### Services

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/services/id/{id}` | Get service by ID |
| GET | `/services/finish/{finish}` | List services by finish status |
| POST | `/services/register` | Register a new service |
| PUT | `/services/update/{id}` | Update service data |
| PATCH | `/services/{id}` | Toggle service finish status |
| DELETE | `/services/delete/{id}` | Delete a service |

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

---

## Tech Stack

- [Python 3](https://python.org)
- [FastAPI](https://fastapi.tiangolo.com)
- [SQLAlchemy 2.0](https://sqlalchemy.org)
- [Pydantic](https://docs.pydantic.dev)
- [SQLite](https://sqlite.org)
- [Uvicorn](https://www.uvicorn.org)

---

## Status

Backend complete. Frontend in development.
