# GMAO - Gestion de Maintenance Assistée par Ordinateur

A web-based application for managing maintenance operations efficiently. This project is built using Django for the backend and React for the frontend, combining powerful features and a modern user interface.

## Features

- **Maintenance Planning & Scheduling**  
  Organize, plan, and track maintenance tasks across your organization.
- **Asset Management**  
  Keep an up‑to‑date inventory of equipment, machines, and other assets.
- **User Management**  
  Create roles, assign permissions, and manage users with ease.
- **Interactive Dashboard**  
  View key metrics, upcoming tasks, and asset health at a glance.
- **Notifications & Reminders**  
  Stay informed with email alerts and in‑app notifications for due or overdue tasks.

## Technologies Used

- **Backend**: Django (Python)  
- **Frontend**: React (JavaScript)  
- **Styling**: SCSS  
- **Database**: PostgreSQL (or configure your preferred DB)  
- **Tools & Libraries**:  
  - Django REST Framework  
  - Axios  
  - React Router  
  - Webpack / Create React App  

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/wailammar99/gmao.git
cd gmao
2. Setup the Backend
Create and activate a virtual environment:

bash
Copier
Modifier
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
Install Python dependencies:

bash
Copier
Modifier
pip install -r requirements.txt
Apply database migrations:

bash
Copier
Modifier
python manage.py migrate
(Optional) Create a superuser:

bash
Copier
Modifier
python manage.py createsuperuser
Start the Django development server:

bash
Copier
Modifier
python manage.py runserver
The backend API will be available at: http://127.0.0.1:8000/

3. Setup the Frontend
Move into the frontend directory:

bash
Copier
Modifier
cd frontend
Install Node.js dependencies:

bash
Copier
Modifier
npm install
Start the React development server:

bash
Copier
Modifier
npm start
The frontend app will be available at: http://localhost:3000/

Usage
Log in with your admin account (if created) to access the dashboard.

Navigate through the sidebar to manage assets, schedule tasks, and view reports.

Configure email settings in backend/settings.py to enable notifications.

Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.

Create a feature branch: git checkout -b feature/YourFeature.

Commit your changes: git commit -m 'Add your feature'.

Push to your branch: git push origin feature/YourFeature.

Open a Pull Request describing your changes.

Please ensure code style consistency and write tests where applicable.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
For questions or support, please reach out to:

Author: Wail Ammar

Email: wailammar99@example.com

GitHub: github.com/wailammar99

markdown
Copier
Modifier
