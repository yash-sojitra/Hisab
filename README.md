# 🧾 Hisab — Your Personal Money Manager

Hisab is a modern, MERN stack (MongoDB, Express, React, Node.js) financial assistant built with TypeScript and Clerk for auth. It helps you effortlessly track daily transactions both income and expenses and analyze your budget with clean visuals and smart features.

---

## 🚀 Features

* **Track Income & Expenses**
  Log your daily transactions with full category assignment (e.g. Food, Rent, Salary).

* **Budget Visualizations**
  Interactive charts and graphs provide insights into spending habits and trends.

* **Paginated, Filtered Listing**
  Easily browse, filter, and sort transaction records fast and smooth UX.

* **Receipt Scanning**
  Just snap a photo of your receipt! OCR powered auto fill saves time and reduces errors.

* **Secure Authentication**
  Clerk handles auth with support for email/password and OAuth providers.

* **TypeScript Everywhere**
  Compile time type safety guards nearly every layer from API to UI.

---

## 🔧 Tech Stack & Architecture

| Layer          | Tools/Frameworks                                          |
| -------------- | --------------------------------------------------------- |
| Authentication | Clerk (email/password + OAuth)                            |
| Backend        | Node.js + Express + MongoDB + Mongoose (TypeScript)       |
| Frontend       | React + TypeScript + Chart.js/Recharts                    |
| Storage        | MongoDB collections for users, transactions, images       |
| OCR            | Gemini 2.5 flash Multimodal                               |
| Dev Tooling    | ESLint, Prettier, React Hook Form, Zod/Yup for validation |

* **Strict Type Validation** ensures that invalid data whether from frontend forms or backend endpoints is caught before deployment.
* **End-to-end Type Safety**: Shared TypeScript types for models like `Transaction`, `User`, etc., minimize runtime issues.

---

## 📦 Getting Started

### 1. Clone

```bash
git clone https://github.com/yash-sojitra/Hisab.git
cd Hisab
```

### 2. Install Dependencies

* **Backend**

  ```bash
  cd server
  npm install
  ```

* **Frontend**

  ```bash
  cd ../client
  npm install
  ```

### 3. Setup Environment Variables

Create `.env` files:

* **backend/.env**

  ```
  MONGO_URI=
  PORT=
  CLERK_WEBHOOK_SIGNING_SECRET=
  CLERK_SECRET_KEY=
  GEMINI_API_KEY=
  ```

* **frontend/.env**

  ```
  VITE_CLERK_PUBLISHABLE_KEY==<your-clerk-publishable-key>
  ```

### 4. Run Locally

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

By default frontend runs at `http://localhost:5173`, talking to backend at `http://localhost:3000`.

---

## 🖼️ Uploading a Receipt

1. Go to **Add Transaction → Upload Receipt**
2. Select or take a photo
3. OCR reads items, amounts, and date
4. You review/edit the auto-filled form
5. Save — it logs both the image and the parsed data

---

## 🧠 Why TypeScript?

* **Strong Typing** prevents bugs from mismatched request schemas or corrupted responses.
* **Shared Interfaces** between frontend and backend promote consistency and reduce duplication.
* **IDE Autocomplete & Refactor Safety** make maintenance and scaling a breeze.

---

## ✔️ Validation Highlights

* **Frontend**: Form validation (with React Hook Form + Zod/Yup) ensures only valid data is submitted.
* **Backend**: API schemas verify received data (e.g. `ADD_TXN` requires `amount: number`, `date: string`, `category: string`, etc.).
* **OCR Parsing**: Parses strings to typed fields; validation ensures quality before saving.

---

## 📝 API Endpoints

* **POST** `/api/auth/*` — Handled by Clerk
* **GET/POST/PUT/DELETE** `/api/transactions` — Authenticated CRUD
* **GET** `/api/transactions?filter=...&page=...` — Supports pagination and filtering
* **POST** `/api/transactions/process-image` — Receives image, OCRs and returns parsed data
* **GET** `/api/transactions/summary` - Receives summary of user needed for dashboard and graphs
* **GET/POST/PUT** `/api/categories/summary` - Authenticated CRU for categories
* **POST** `/api/user/webhooks` - for sync between clerk and user Database

---

## 📺 Demonstration Video

[Demonstration Video](https://drive.google.com/file/d/1GWHJZYxoAcIbGUGo2qa65_paVYpHBred/view?usp=sharing)

---

## 🖥️ ScreenShots

<img width="1440" height="783" alt="Screenshot 2025-07-21 at 6 40 01 AM" src="https://github.com/user-attachments/assets/685f5345-d4ea-4f85-aaab-aaf18b8207a4" />
<img width="1439" height="780" alt="Screenshot 2025-07-21 at 6 41 36 AM" src="https://github.com/user-attachments/assets/acae1ebf-5c20-4f7c-8d26-a0278882012f" />
<img width="1440" height="781" alt="Screenshot 2025-07-21 at 6 41 11 AM" src="https://github.com/user-attachments/assets/99c186d8-a1a7-4797-a709-a0843d57b8f3" />
<img width="1439" height="780" alt="Screenshot 2025-07-21 at 6 41 49 AM" src="https://github.com/user-attachments/assets/3d8af716-0998-4e7b-8308-da5926f09844" />
<img width="1440" height="781" alt="Screenshot 2025-07-21 at 6 42 28 AM" src="https://github.com/user-attachments/assets/619fdc74-44fe-4fa2-b180-e14a0e1d47fd" />


