# 💈 Barber Shop Management System

A full-stack, role-based appointment booking and scheduling platform for barber shops, built using **.NET 9 Web API**, **React**, **PostgreSQL**, and **Azure-ready deployment**. This system supports customers, barbers, and administrators with secure logins, time slot management, and appointment tracking.

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Setup Instructions](#-setup-instructions)
  - [1. Backend Setup (.NET 9)](#1-backend-setup-net-9)
  - [2. Frontend Setup (React)](#2-frontend-setup-react)
  - [3. Database Setup (PostgreSQL via PgAdmin)](#3-database-setup-postgresql-via-pgadmin)
- [Usage Guidelines](#-usage-guidelines)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [License](#-license)

---

## ✨ Features

- ✅ Secure Registration & Login with JWT
- ✅ Role-Based Authorization (`Admin`, `Barber`, `Customer`)
- ✅ Customers can book 20-minute appointment slots (9:00–16:00)
- ✅ Barbers can view/edit only their assigned appointments
- ✅ Admins can manage all users and appointments
- ✅ Dynamic working hours with global and barber-specific overrides
- ✅ Available time slot filtering
- ✅ React frontend with Tailwind and shadcn/ui
- ✅ Unit tested with xUnit & Moq
- ✅ Azure-ready with CI/CD pipeline support

---

## 🛠 Tech Stack

| Layer        | Technology                        |
|--------------|------------------------------------|
| Backend      | .NET 9 Web API, EF Core            |
| Frontend     | React, Vite, Tailwind CSS, shadcn/ui |
| Database     | PostgreSQL, PgAdmin                |
| Auth         | ASP.NET Core Identity + JWT        |
| Testing      | xUnit, Moq                         |
| Deployment   | Azure App Services + GitHub Actions |

---

## ⚙ Setup Instructions

### 1. Backend Setup (.NET 9)

```bash
cd Barber_Shop
dotnet restore
dotnet ef database update
dotnet run
```

Make sure appsettings.json includes your PostgreSQL connection string.
Example:
```
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=BarberShopDb;Username=postgres;Password=yourpassword"
}
```
---

##2-frontend-setup-react

```bash
cd barber-shop-frontend
npm install
npm run dev
```

---

##3-database-setup-postgresql-via-pgadmin

1.Install PostgreSQL
2.Open PgAdmin
3.Create a database named BarberShopDb
4.Ensure the backend connection string in appsettings.json matches

---

##-usage-guidelines

Roles
  Customer: Register → Book appointments → View own history
  Barber: See assigned bookings → Change appointment status
  Admin: Manage users, assign roles, delete appointments, configure working hours

Appointment Rules
  Appointments are 20 minutes
  Only today or future dates can be selected
  No double bookings allowed for the same barber & time

---

##-testing

Run Unit Tests:
```bash
cd Barber_Shop.Tests
dotnet test
```

Test Coverage Includes:
  AppointmentService
  AppointmentRepository
  AppointmentsController
  Business logic and validation

---

##project-structure

Barber_Shop/
├── Controllers/
├── DTOs/
├── Models/
├── Services/
├── Repositories/
├── Data/ (DbContext)
├── Program.cs
Barber_Shop.Tests/
barber-shop-frontend/
README.md

---

##-license

MIT License. Feel free to use and modify this project for learning or commercial use.
