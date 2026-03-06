# Room Booking System

A small full-stack project where users can register, log in, view available rooms, and book rooms for specific dates. The system prevents overlapping bookings and disallows bookings in the past.

## Tech Stack

* **Frontend:** React, TailwindCSS, Axios, React Router
* **Backend:** Node.js, Express
* **Database:** MySQL
* **Auth:** JWT + bcrypt

## Features

* User registration & login
* View available rooms
* Book rooms with date validation
* Prevent double bookings
* View personal bookings

## Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

Create `backend/.env`

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=room_booking
JWT_SECRET=secret
PORT=5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env`

```
VITE_API_URL=http://localhost:5000
```
Auth

POST /api/auth/register  
Registers a new user

POST /api/auth/login  
Logs in a user and returns a JWT token


Rooms

GET /api/rooms  
Returns the list of available rooms


Bookings

POST /api/bookings  
Creates a new booking

GET /api/bookings/my/:userId  
Returns bookings for the logged-in user
```

## Database Schema

Users
- id (INT, Primary Key)
- name (VARCHAR)
- email (VARCHAR, Unique)
- password (VARCHAR)

Rooms
- id (INT, Primary Key)
- name (VARCHAR)
- price_per_night (INT)

Bookings
- id (INT, Primary Key)
- user_id (INT, Foreign Key → users.id)
- room_id (INT, Foreign Key → rooms.id)
- start_date (DATE)
- end_date (DATE)
- created_at (TIMESTAMP)
```

## Author

Milan Yadav
