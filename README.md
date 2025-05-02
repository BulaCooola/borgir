# borgir
Borgir will be a burger review and blog website that allows users to discover, review, and share their favorite burger spots. This platform will feature reviews, ratings, and blog posts about different burgers and restaurants.

## How to Run 🛠️

To run the Borgir full-stack application locally, follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/borgir.git
cd borgir
```

### 2. Install Dependencies
```bash
cd server
npm install
```
Go back to the root of the application `cd ..` and install frontend dependencies
```bash
cd borgir-app
npm install
```

### 3. Set up Environment Variables
Make sure you create a .env file in the /server directory with the following variables:
```bash
JWT_SECRET=your_jwt_secret
```
JWT_Secret can be any if you want to run locally

### 4. Running the application
```bash
cd server
npm run start
```
In another terminal, start the frontend
```
cd borgir-app
npm run dev
```
The backend will run on http://localhost:3000, and the frontend will typically run on http://localhost:5173.

You can explore the application on http://localhost:5173

