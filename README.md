💰 MoneyWiz – Intelligent Expense Management System

MoneyWiz is a full-stack web application designed to help users track, manage, and analyze their expenses efficiently. The system provides an interactive dashboard, expense categorization, and AI-powered financial insights that help users understand their spending habits and improve savings.

This project was developed as part of the MCA Master Project.

🎓 Project Information
Field	Details
Project Title	MoneyWiz – Intelligent Expense Management
Course	Master of Computer Applications (MCA)
College	DPG School of Technology & Management
University	Maharishi Dayanand University
Technology	Next.js, MongoDB, TypeScript
Duration	Feb 2026 – May 2026
🎯 Project Objectives

The main objectives of this project are:

To develop a web-based expense management system

To help users track daily expenses easily

To provide AI-based spending insights

To visualize spending data using charts and dashboards

To maintain secure user authentication

To generate printable expense reports

✨ Key Features
1️⃣ User Authentication

Secure login and registration

Password encryption using bcrypt

JWT based authentication

2️⃣ Expense Management

Users can:

Create expense categories

Add expenditures

Edit or delete transactions

3️⃣ Interactive Dashboard

Displays:

Total expenses

Recent transactions

Spending overview

4️⃣ AI Financial Insights

Analyzes spending habits

Suggests ways to save money

5️⃣ Profile Management

Users can update:

Name

Profile picture

6️⃣ Responsive UI

The application works on:

Desktop

Tablet

Mobile devices

7️⃣ Printable Reports

Users can generate a printable expense report.

🛠 Technology Stack
Frontend

Next.js (App Router)

TypeScript

Tailwind CSS

ShadCN UI

Framer Motion

Backend

Node.js

Next.js API Routes

Database

MongoDB

Mongoose

Authentication

JWT

bcrypt.js

AI Integration

Firebase Genkit

🏗 System Architecture

The application follows a full-stack architecture.

Client (Next.js UI)
        │
        ▼
API Routes (Next.js Backend)
        │
        ▼
MongoDB Database
📂 Project Structure
src
│
├── ai/                    # AI logic and Genkit flows
│
├── app/                   # Next.js pages
│   ├── api/               # Backend APIs
│   ├── dashboard/         # User dashboard
│   ├── expense/           # Expense details page
│   ├── profile/           # Profile page
│   └── page.tsx           # Landing page
│
├── components/            # Reusable components
│
├── hooks/                 # Custom React hooks
│
├── lib/                   # Utility functions
│
├── models/                # Database schemas
│
└── middleware.ts          # Authentication middleware
⚙ Installation & Setup

Follow these steps to run the project locally.

1️⃣ Clone the Repository
git clone <repository-url>
cd moneywiz
2️⃣ Install Dependencies
npm install
3️⃣ Environment Variables

Create .env file in the root directory.

MONGO_URI="your_mongodb_connection_string"
JWT_SECRET="your_secret_key"
4️⃣ Run Development Server
npm run dev

Open the application at:

http://localhost:9002
🔌 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
POST	/api/auth/logout	Logout user
User
Method	Endpoint	Description
GET	/api/auth/user	Get user profile
PUT	/api/auth/user	Update profile
Expenses
Method	Endpoint	Description
GET	/api/expenses	Get all expenses
POST	/api/expenses	Create expense
PUT	/api/expenses/[id]	Update expense
DELETE	/api/expenses/[id]	Delete expense
📊 Database Models
User Model

Stores:

Name

Email

Password

Avatar

Expense Model

Stores:

Expense title

Expenditures list

Amount

Date

🧪 Testing

Testing includes:

API testing

Authentication testing

Expense CRUD operations

Dashboard functionality

Test cases were created to ensure:

Correct expense calculations

Secure authentication

Proper error handling


Possible future enhancements:

Mobile application version

AI based budget prediction

Expense reminder notifications

Multi-user family budgeting

📜 License

This project is developed for educational purposes as part of MCA coursework.