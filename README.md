# Expenses Tracker API

A scalable RESTful API built with Node.js and Express for managing expenses, featuring user authentication, role-based access control, and advanced filtering capabilities.

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- Bcrypt.js
- dotenv
- multer
- Redis

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mansigohil10/Expence-tracker-app.git
   
2. Install dependencies:

    ```bash
    npm install

3. .env file

     ```
    MONGO_URI=your_mongo_db_connection_string
    PORT=5000
    JWT_SECRET=your_jwt_secret_key

    ```

4. Start the development server:

   ```bash
   npm start
   The server should now be running at http://localhost:5000
   ```

## Environment Variables
- PORT: The port for the server to listen on.
- MONGODB_URI: Your MongoDB connection string.
- JWT_SECRET: Secret key for signing JWT tokens.