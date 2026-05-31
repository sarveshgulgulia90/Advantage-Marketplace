# Advantage Silchar Marketplace

A modern full-stack MERN marketplace platform developed for **Advantage Silchar**, enabling customers to browse products, compare specifications, receive AI-powered recommendations, request quotations, and connect directly with the business through WhatsApp.

The platform also includes an administrative dashboard for managing products, inventory, and marketplace content.

---

## Features

### Customer Features

* Browse products by category
* Product search and filtering
* Detailed product specifications
* Side-by-side product comparison
* AI-powered product recommendations
* WhatsApp enquiry integration
* Quote request system
* Responsive user interface
* Product highlights and technical details

### AI Features

* Google Gemini AI integration
* Smart product comparison
* Personalized buying recommendations
* Use-case based product analysis
* Intelligent product selection assistance

### Admin Features

* Secure admin dashboard
* Add new products
* Edit existing products
* Delete products
* Product image management
* Category management
* Inventory management

---

## Tech Stack

### Frontend

* React.js
* Vite
* JavaScript (ES6+)
* CSS3

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Integrations

* Google Gemini AI
* WhatsApp Integration
* REST APIs

---

## Folder Structure

```bash
advantage-silchar/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── Admin.jsx
│   ├── api.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── server/
│   ├── middleware/
│   ├── models/
│   │   └── Product.js
│   ├── routes/
│   │   ├── products.js
│   │   └── inquiries.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── .env.local
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd advantage-silchar
```

### Install Frontend Dependencies

```bash
npm install
```

### Install Backend Dependencies

```bash
cd server
npm install
```

---

## Environment Variables

Create a `.env` file inside the `server` directory:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_google_gemini_api_key
```

---

## Running the Application

### Start Backend Server

```bash
cd server
node server.js
```

### Start Frontend

```bash
npm run dev
```

Application URLs:

```txt
Frontend: http://localhost:5173
Backend : http://localhost:5000
```

---

## Google Gemini AI Setup

This project uses **Google Gemini AI** to provide intelligent product recommendations and comparison insights.

### Get Gemini API Key

1. Visit Google AI Studio
2. Create or sign in with your Google account
3. Generate an API key
4. Add the key to your backend `.env` file

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

5. Restart the backend server

```bash
node server.js
```

---

## Core Modules

### Product Management

* Product creation and updates
* Product image support
* Product categorization
* Technical specification management

### Product Comparison

* Side-by-side comparison
* Specification highlighting
* Price comparison
* Feature analysis
* AI-assisted recommendations

### Inquiry Management

* Customer quote requests
* Lead generation
* WhatsApp communication
* Contact information collection

### Admin Dashboard

* Product management
* Marketplace administration
* Inventory control
* Content management

---

## Future Enhancements

* User authentication
* Customer accounts
* Shopping cart functionality
* Online payment gateway integration
* Order tracking system
* Product reviews and ratings
* Analytics dashboard
* Email notifications
* Order management system


