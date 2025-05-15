## School Vaccination Portal
A simple, elegant React-based portal to manage student vaccination data. This app allows admins to:
✅ Manage students
✅ Upload data in bulk
✅ Track vaccination drives
✅ Generate reports (Excel, CSV, PDF)
✅ Admin login/logout with protected routes

## ✨ Features
🔐 Admin Login with protected routes.
🏠 Dashboard overview.
🧑‍🎓 Manage Students — CRUD operations.
📤 Bulk Upload — Upload CSV/Excel files.
📊 Reports Generation — Export to Excel, CSV, PDF.
🚪 Logout Functionality.
🎨 Clean, responsive UI with Bootstrap styling.

## 🛠️ Technology Stack

 **React.js**          Core frontend library for building interactive and maintainable user interfaces. 
 **React Router**      Enables smooth and efficient client-side navigation within the application.     
 **Bootstrap**         Provides a responsive and aesthetically pleasing foundation for the UI.          
 **xlsx / jsPDF**      Facilitates robust generation of reports in Excel and PDF formats.              
 **LocalStorage**      Simple and effective client-side persistence for managing authentication state. 

 ## 🚀 Getting Started

1️⃣ Clone this repo:
                    git clone https://github.com/aishwaryakchikorde/SchoolVaccinationPortal.git
                    
                    cd school-vaccination-portal

2️⃣ Install Dependencies:

                         npm start

## 🧪 Dummy Login Credentials
**Username**	   **Password**
admin	            admin

This is a demo app. No actual user database is hooked up.

## 📝 Notes
🛡️ This project uses localStorage for login state (for demo purposes).

🔒 In production, replace with proper auth backend & JWT.

🖼️ Excel/PDF report export is powered by xlsx & jspdf.

 ## 📂 Project Structure

```bash
school-vaccination-portal/
├── public/
├── src/
│   ├── components/
│   │   ├── Dashboard.js
│   │   ├── StudentTable.js
│   │   ├── BulkUpload.js
│   │   ├── Drives.js
│   │   ├── ReportTable.js
│   │   ├── Login.js
│   │   └── ProtectedRoute.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md








                         


