# MediTrace Portal

A web portal for Pharmaceutical product traceability letting manufacturers register and track their product batches while administrators oversee the system, approve users and audit scan activity across the supply chain.

Built with React and Vite.

## Features

### Authentication
- Role-based access control (Admin / Manufacturer) handled through a central `AuthContext`.
- Login flow that routes users to the correct dashboard based on their role.

### Manufacturer
- Dashboard - overview of the manufacturer's activity.
- Register Product - add a new product to the system.
- My Products - view and manage registered products.
- Batches - create and track production batches.

### Admin
- Dashboard - system-wide overview.
- All Products - view every product across all manufacturers.
- Pending Users - review and approve new account requests.
- Scan Logs - audit when and where products were scanned.
- Reports - generate reports on system activity.

## Tech Stack

- React - UI library
- Vite - build tool & dev server (with HMR)
- ESLint - linting
- React Context API - global auth state


## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (comes with Node)

### Installation

```bash
# Clone the repository
git clone <https://github.com/VenusKareen/MediTrace-Portal.git>
cd MediTrace-Portal

# Install dependencies
npm install
```

### Running the app

```bash
npm run dev
```

The app runs at **http://localhost:3002** (port set in `vite.config.js`).

### Other scripts

```bash
npm run build     # Build for production
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

---

## Project Structure

```
MediTrace-Portal/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx       # Auth state & role management
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AllProducts.jsx
│   │   │   ├── PendingUsers.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── ScanLogs.jsx
│   │   ├── manufacturer/
│   │   │   ├── Batches.jsx
│   │   │   ├── MfgDashboard.jsx
│   │   │   ├── MyProducts.jsx
│   │   │   └── RegisterProduct.jsx
│   │   └── Login.jsx
│   ├── App.jsx                   # Routes & layout
│   ├── main.jsx                  # App entry point
│   └── index.css                 # Global styles
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## Backend / API

> Where the API lives (e.g. a separate repo, a `/server` folder, or a hosted endpoint), and add any required environment variables here, e.g.:
>
> ```
> VITE_API_URL=http://localhost:5000
> ```

## Author
Venus Kareen - https://github.com/VenusKareen