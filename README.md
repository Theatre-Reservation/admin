# 🎭 Theater Reservation System - Admin Dashboard

This project is an **Admin Dashboard** designed to manage theater reservations, shows, seating arrangements, and generate insightful reports. Developed with a focus on user-friendliness, scalability, and maintainability, this dashboard provides theater administrators with all the essential tools needed to efficiently manage theater operations.

<b>link</b> - https://flash-ticket-admin.netlify.app/

## 🌟 Features

- **Dynamic Dashboard**: Real-time data display on reservations, shows, and seating.
- **Show Management**: Add, edit, and delete show details, including schedules and theater-specific information.
- **Reservation Management**: Handle customer reservations with comprehensive details and search options.
- **Seat Selection**: Interactive seat selection and updates for accurate seating management.
- **Report Generation**: Generate custom reports by time period (daily, weekly, monthly) on revenue, popular shows, and more.
- **Authentication**: Secure login to restrict access to authorized administrators only.

## Admin Interfaces

<p float="left">
    <img src="/public/images/image1.png" width="45%" />
    <img src="/public/images/image.png" width="45%" />
</p>
<p float="left">
    <img src="/public/images/image-1.png" width="45%" />
    <img src="/public/images/image-2.png" width="45%" />
</p>
<p float="left">
    <img src="/public/images/image-3.png" width="45%" />
    <img src="/public/images/image-4.png" width="45%" />
</p>
<p float="left">
    <img src="/public/images/image-5.png" width="45%" />
    <img src="/public/images/image-6.png" width="45%" />
</p>
<p float="left">
    <img src="/public/images/image-7.png" width="45%" />
</p>

## 📂 Project Structure

```plaintext
project_root/
├── src/
│   ├── components/                 # Core UI components
│   │   ├── Header.js               # Header navigation component
│   │   ├── Sidebar.js              # Sidebar menu for navigation
│   │   ├── Dashboard.js            # Main dashboard layout
│   │   ├── Reservations.js         # Component for reservation management
│   │   ├── Shows.js                # Component to manage shows
│   │   ├── Seats.js                # Component to manage seating
│   │   ├── Reports.js              # Component for report generation
│   │   └── common/                 # Reusable common components
│   │       ├── Button.js           # Custom button component
│   │       └── Card.js             # Custom card component
│   ├── pages/                      # Page components
│   │   ├── EventPage.js            # Event management page
│   │   ├── DashboardPage.js        # Main dashboard page
│   │   ├── LoginPage.js            # Authentication page
│   │   ├── ReportsPage.js          # Reports overview page
│   │   ├── ReservationsPage.js     # Reservations management page
│   │   ├── SeatsPage.js            # Seat management page
│   │   └── ShowsPage.js            # Shows management page
│   ├── services/                   # Service modules
│   │   ├── api.js                  # API service for data interactions
│   │   └── auth.js                 # Authentication services
│   ├── App.js                      # Main application component
│   ├── App.css                     # Global styles
│   ├── main.js                     # Main entry point
│   └── index.css                   # Base styling
└── README.md                       # Project documentation
```

## 🛠️ Technologies Used

- **Frontend**: React, CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **State Management**: React Hooks
- **Authentication**: JWT-based secure login
- **API**: RESTful APIs for data management and operations

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 20.x)
- **MongoDB** (hosted)
- **npm**

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com:Theatre-Reservation/admin.git
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
