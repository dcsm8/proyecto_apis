# Culinary Cultures API Sonar

## Enlaces de interés

[Jenkins](http://157.253.238.75:8080/jenkins-misovirtual/). Para tener acceso deben iniciar sesión con su usuario de GitHub.

[Sonar](http://157.253.238.75:8080/sonar-misovirtual/). No se requieren crededenciales de acceso.

This project is a REST API for managing information about various culinary cultures around the world. It's built with NestJS and uses a PostgreSQL database.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Docker and Docker Compose

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/MISW4403-Diseno-y-construccion-de-APIs/MISW4403_202414_E04
   cd culinary-cultures-api
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:

   - Rename the `.env.example` file to `.env`:
     ```
     mv .env.example .env
     ```
   - Open the `.env` file and update the values with your actual database credentials and other configuration details:
     ```
     DB_HOST=db
     DB_PORT=5432
     DB_USERNAME=your_database_username
     DB_PASSWORD=your_database_password
     DB_NAME=your_database_name
     NODE_ENV=development
     ```

4. Start the PostgreSQL database using Docker Compose:

   ```
   docker-compose up -d
   ```

   This command will start a PostgreSQL container based on the configuration in your `docker-compose.yml` file.

5. Start the application:
   ```
   npm run start:dev
   ```

The API should now be running on `http://localhost:3000`.

## Environment Variables

This project uses environment variables for configuration. The `.env` file is used to store these variables locally. Here's what each variable means:

- `DB_HOST`: The hostname of your PostgreSQL database (use `db` when using Docker Compose)
- `DB_PORT`: The port number on which your PostgreSQL database is running (usually 5432)
- `DB_USERNAME`: Your PostgreSQL username
- `DB_PASSWORD`: Your PostgreSQL password
- `DB_NAME`: The name of your PostgreSQL database
- `NODE_ENV`: The current environment (development, test, or production)

Remember to never commit your `.env` file to version control. The `.env.example` file serves as a template for the required environment variables.

## Using Docker Compose

This project includes a `docker-compose.yml` file to easily set up the PostgreSQL database. To use it:

1. Make sure Docker and Docker Compose are installed on your system.
2. Run `docker-compose up -d` to start the PostgreSQL container in detached mode.
3. The database will be accessible on the host and port specified in your `.env` file.

To stop the database, run `docker-compose down`.

## API Documentation

Import the docs/postman-collection.json file to Postman

## Running Tests

```
npm run test
```
