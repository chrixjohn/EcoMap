# EcoMap 
EcoMap is a platform for biodiversity conservation that identifies biodiversity hotspots of various animals across India using user-provided data, commonly referred to as citizen science.

## Project Overview

EcoMap is a Node.js-based application designed to manage and process environmental data efficiently. It uses Express for the backend framework, Mongoose for database operations, and integrates cloud storage via Cloudinary.

## Features

- Role-based access control for Admins, Experts, and Users
- Password recovery with OTP verification
- User management (registration, login, profile updates, and deletion)
- Expert contributions and approval system of spottings
- Admin panel for managing users, experts, and species data
- Spotting system for users to report species sightings
- Species occurrence tracking and mapping
- GeoJSON-based mapping for environmental data visualization


## Installation

### Prerequisites

- Node.js (>=14.x recommended)
- MongoDB

### Setup Instructions

1. Clone the repository:

   ```sh
   git clone https://github.com/chrixjohn/EcoMap.git
   cd ecomap
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env` and configure your environment variables.

4. Start the application:

   - For production:
     ```sh
     npm start
     ```
   - For development:
     ```sh
     npm run dev
     ```

## Scripts

- `npm start` - Runs the application in production mode.
- `npm run dev` - Runs the application with nodemon for live development.
- `npm test` - Placeholder for running tests.

## Dependencies

- **Express** - Web framework
- **Mongoose** - MongoDB ODM
- **Cloudinary** - Cloud storage
- **Multer** - File upload middleware
- **jsonwebtoken** - Authentication
- **bcrypt** - Password hashing
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing
- **crypto** - Cryptographic functions for security
- **nodemailer** - Email handling

## License

This project is licensed under the MIT License.

