# PayEasy

## Overview
This is a peer-to-peer money transfer application designed with a simple, user-friendly interface. It allows users to manage their accounts, view their balance, search for other users, and send money, all within a secure, authenticated environment.

## Features
- User authentication with JWT
- View account balance
- Search and filter users
- Send money to users
- Responsive UI for a seamless experience

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT
- **API Communication**: Axios

## Installation
To set up the project locally, follow these steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/ArindamDongre/PayEasy.git
   cd PayEasy
   ```
2. For both backend and frontend, install dependencies by running:
   ```bash
   npm install
   ```
3. Setup up environment variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. Run the application:
   - Start the backend server:
     ```bash
     cd backend
     node index.js
     ```
   - Start the frontend:
     ```bash
     cd frontend
     npm run start
     ```
## Usage
1. Open your browser and go to http://localhost:3000.
2. Register a new account or log in with existing credentials.
3. View your balance and search for users to send money.

## API Endpoints

| Method | Endpoint               | Description                |
|--------|------------------------|----------------------------|
| GET    | `/api/v1/user/me`       | Get current user information |
| GET    | `/api/v1/account/balance`| Get account balance         |
| GET    | `/api/v1/user/bulk`     | Get a list of users         |
| POST   | `/api/v1/user/signup`   | Register a new user         |
| POST   | `/api/v1/user/signin`   | Log in a user               |
| POST   | `/api/v1/account/transfer`  | Transfer money to a user |
| PUT    | `/api/v1/user`          | Update user information     |

## Contributing
Contributions are welcome! Please feel free to submit a pull request.


