# 💰 Personal Finance Dashboard

A comprehensive web application designed to help users effectively manage their personal finances, track spending, set budgets, and gain visual insights into their financial health.

## ✨ Features

The Personal Finance Dashboard provides a rich set of features for streamlined financial management:

### Dashboard Overview
* **Total Financial Snapshot:** Display of total available balance and the overall count of recorded transactions.
* **Monthly Performance:** Calculation of the total spend for the current calendar month.
* **Budget Tracking:** Real-time comparison of the current month's spending against the set monthly budget, including percentage usage.
* **Visual Insights:** An intuitive chart powered by D3.js providing a visual overview of spending patterns.

### Transaction Management
* **Recent Activity:** View a list of the most recent transactions.
* **Filtering (Planned):** Future capability to filter transactions by category, date range, and amount.

### Budget Management
* **Goal Setting:** Ability to set and view monthly budget goals.
* **Usage Tracking:** Clear visualization of the percentage of the budget utilized.

### Technology & Design
* **Data Visualization:** Custom, insightful charts implemented using **D3.js**.
* **Responsive UI:** A simple, clean, and modern user interface built with **React** and **Tailwind CSS**, ensuring an optimal experience on both **mobile and desktop** devices.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React, TypeScript, Tailwind CSS | Modern, component-based UI framework for a robust and scalable client. |
| **Charts** | D3.js | Powerful library for producing dynamic and interactive data visualizations. |
| **Backend** | Node.js, Express | Fast, scalable server-side environment and a robust web framework. |
| **Database** | PostgreSQL, Prisma ORM | Enterprise-grade relational database and a modern database toolkit for type-safe data access. |
| **Authentication** | JWT (JSON Web Tokens) | Secure, stateless authentication for API access. |

---

## 🚀 API Endpoints

The backend is structured around the following key API endpoints:

### Transactions
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/transactions/summary` | Retrieves the overall total balance and transaction count. |
| `GET` | `/transactions` | Retrieves a paginated list of all transactions. |

**Example Response: `/transactions/summary`**
```json
{
  "totalBalance": 150000.50,
  "transactionCount": 125
}
Example Query & Response: /transactions?page=1&perPage=5JSON{
  "meta": {
    "total": 125,
    "page": 1,
    "perPage": 5,
    "totalPages": 25
  },
  "data": [
    // ... transaction objects
  ]
}
BudgetsMethodEndpointDescriptionGET/budgetsRetrieves a budget for a specified month/year (?month=<number>&year=<number>).POST/budgetsCreates a new monthly budget.Example Request Body: POST /budgetsJSON{
  "month": 11,
  "year": 2025,
  "amount": 50000
}
⚙️ Setup and InstallationFollow these steps to get the application running on your local machine.1. Clone the RepositoryBashgit clone <repo-url>
cd personal-finance-dashboard
2. Install DependenciesInstall packages for both the frontend (Next.js) and the backend.Bashnpm install
3. Environment ConfigurationCreate a .env file in the project root based on a provided template (if available) and configure your:Database Credentials (for PostgreSQL)JWT Secret Key (for authentication)4. Run Database MigrationsApply the Prisma schema to your PostgreSQL database.Bashnpx prisma migrate dev
5. Start the ServersRun the backend API and the frontend Next.js server concurrently.Start Backend Server (Node.js/Express):Bashnpm run dev
Start Frontend Server (Next.js/React):Bashnpm run dev
The application will typically be accessible at http://localhost:3000.📝 NotesCurrency: All financial amounts within the application are denominated in ₹ (Indian Rupees - INR).Monthly Spend: The calculated monthly spend strictly accounts for expenses incurred within the current calendar month.