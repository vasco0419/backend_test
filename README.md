## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Project Stack and Setup Guide
1. Stack Used
For this project, the following technologies were used:

Front-End: React.js with Next.js 
Back-End: Node.js (v20) with Express.js
Database: MySQL (Maria DB 10.1.7)

2. Technology Selection and Justification
Next.js – Front-End Framework:

Built on React.js , offering server-side rendering (SSR) and static site generation (SSG).
Enhances website performance and SEO.
Provides an optimized developer experience with built-in API routes.
Express.js  – Back-End Framework:

A minimalist and efficient framework running on Node.js (v20).
Handles API requests efficiently with middleware support.
Ensures high-speed execution with JavaScript on the server side.

MySQL – Database:

A relational database management system (RDBMS) for structured data storage.
Ideal for this test project due to its simplicity and reliability.
For real-world application scaling, PostgreSQL is recommended for better handling of large datasets and improved security.

3. Additional Packages Used
Several key packages were integrated into the project:

jsonwebtoken (v9) – Manages user authentication and session handling.
sequelize (v6) – ORM (Object-Relational Mapping) for handling database models and migrations.
bcryptjs (v2.4) – Encrypts user passwords for security.

4. Database Structure
The system uses MySQL (v8) to establish relationships between article posters and comment posters while enabling full CRUD (Create, Read, Update, Delete) operations.

About the test, I deployed the project on next address. You can see some test blogs there and can check there:
167.88.166.21.3003

