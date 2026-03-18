# MoneyWiz - Intelligent Expense Management

MoneyWiz is a modern, full-stack web application designed to provide an intelligent and effortless way to manage your expenses. It features a sleek, animated user interface, robust authentication, and powerful AI-driven insights to help users gain control over their financial health.

![Landing Page](https://picsum.photos/1200/600)

## ✨ Features

*   **Modern Landing Page**: A beautiful, animated, and responsive landing page with sections for Home, About, Features, and Testimonials.
*   **User Authentication**: Secure user registration and login system using JWT and bcrypt for password hashing.
*   **Interactive Dashboard**: A central hub displaying a summary of expenses, quick-add forms, and recent transactions.
*   **Expense Management**: Create, read, update, and delete expense categories (e.g., "Monthly Groceries", "Vacation").
*   **Expenditure Tracking**: Add individual expenditures to each expense, including amount and name.
*   **Optimistic UI Updates**: A fast and responsive user experience using optimistic updates for data mutations. Changes appear instantly in the UI.
*   **User Profile Management**: A dedicated profile page where users can update their name and profile picture.
*   **AI-Powered Insights**: Utilizes Genkit to analyze spending habits and provide actionable advice for savings.
*   **Modal-Based Auth**: Seamless sign-in and sign-up experience through non-intrusive modals.
*   **Fully Responsive**: A mobile-first design that looks and works great on all devices, from desktops to smartphones.
*   **Print Functionality**: Generate a clean, printable report for any expense.

## 🚀 Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [ShadCN/UI](https://ui.shadcn.com/) for components.
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) for object data modeling.
*   **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/), [bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
*   **AI/Generative**: [Genkit](https://firebase.google.com/docs/genkit)
*   **State Management**: React Hooks (`useState`, `useEffect`, `useContext`) combined with a custom `useExpenses` hook for efficient data fetching, caching, and optimistic updates.
*   **Form Management**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation.

## 🏁 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <project-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a file named `.env` in the root of your project and add the following variables. Replace the placeholder values with your actual data.

    ```env
    # Your MongoDB connection string
    MONGO_URI="mongodb+srv://Avdhesh1:ya4XYnQUEtYhv5kr@cluster0.0uojesi.mongodb.net/MoneyWiz"

    # A strong, secret key for signing JWTs
    JWT_SECRET="YOUR_SUPER_SECRET_JWT_KEY"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:9002`.

## 📂 Project Structure

The project follows a standard Next.js App Router structure:

```
src
├── ai/                    # Genkit flows and configuration
├── app/                   # Next.js pages and API routes
│   ├── api/               # Backend API endpoints
│   ├── dashboard/         # Dashboard page
│   ├── expense/           # Dynamic page for a single expense
│   ├── profile/           # User profile page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable UI components
│   ├── ui/                # ShadCN UI components
│   └── *.tsx              # Application-specific components
├── hooks/                 # Custom React hooks
│   └── use-expenses.ts    # Main hook for managing expense data
├── lib/                   # Core utilities and libraries
│   ├── auth.ts            # Authentication helpers
│   ├── db.ts              # Database connection logic
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # General utility functions
├── middleware.ts          # Authentication and routing middleware
└── models/                # Mongoose schemas for database models
    ├── Expense.ts
    └── User.ts
```

## 🔌 API Endpoints

The backend is built using Next.js API Routes.

*   `POST /api/auth/register`: Creates a new user.
*   `POST /api/auth/login`: Authenticates a user and returns a JWT.
*   `POST /api/auth/logout`: Clears the authentication cookie.
*   `GET /api/auth/user`: Retrieves the currently authenticated user's data.
*   `PUT /api/auth/user`: Updates the authenticated user's profile (name, avatar).
*   `GET /api/expenses`: Fetches all expenses for the logged-in user.
*   `POST /api/expenses`: Creates a new expense.
*   `GET /api/expenses/[id]`: Fetches a single expense by its ID.
*   `PUT /api/expenses/[id]`: Updates an expense's details.
*   `DELETE /api/expenses/[id]`: Deletes an expense.
*   `POST /api/expenses/[id]/expenditures`: Adds a new expenditure to an expense.
*   `PUT /api/expenses/[id]/expenditures/[expenditureId]`: Updates an expenditure.
*   `DELETE /api/expenses/[id]/expenditures/[expenditureId]`: Deletes an expenditure.

## 🤖 AI Features

The application leverages **Genkit** to provide AI-powered spending analysis.

*   **`src/ai/flows/spending-insights.ts`**: This flow accepts a list of a user's expenditures. It uses a generative model to analyze spending patterns and returns a summary and actionable insights for potential savings. This feature can be integrated into the dashboard to provide users with personalized financial advice.
