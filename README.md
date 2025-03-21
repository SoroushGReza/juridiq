# JuridiQ

**Status: Under Development**  
This project is actively being developed. Features may change and the codebase is not yet stable.


## Overview
A user-friendly website built with Django REST Framework (DRF) and React, designed to provide legal advice and assistance with writing appeals for individuals in Sweden.

## Tech Stack
### Backend: 
- Django 
- Django REST Framework
- JWT authentication, and CORS headers.

### Frontend: 
- React (via Vite)
- React Bootstrap 
- Font Awesome

## Prerequisites
 - Python 3.9+
 - Node.js (LTS recommended, e.g. Node 20)

## Backend Setup (Django & DRF)
1. Create a virtual environment: <br>
`python -m venv venv`
2. Activate the virtual enviroment (windows): <br>
`venv\Scripts\activate`
3. Install Python dependencies: <br>
`pip install -r requirements.txt`
4. Apply migrations: <br>
`python manage.py migrate`
5. Start the Django Server: <br>
`python manage.py runserver`

#### Backend runs locally on `http://localhost:8000/ `

## Frontend Setup
1. Navigate to the frontend directory: <br>
`cd frontend`
2. Install Node dependencies: <br>
`npm install`
3. Run the development server: <br>
`npm run dev`

#### Frontend runs locally on `http://localhost:5173/` 
