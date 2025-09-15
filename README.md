# Buyer Lead Intake

A Next.js (App Router) + TypeScript app for capturing, listing, and managing buyer leads with Prisma SQLite, Zod validation, and simple demo authentication.

---

## Features

- Create, list, edit, and delete buyer leads with ownership enforcement  
- Server-side pagination, search, filtering, and sorting  
- CSV import (with validation and error reporting) and export of leads  
- Simple demo login with JWT-based authentication  
- Client and server validation using Zod schemas  
- Concurrency control scaffolded via `updatedAt` timestamps  
- Buyer history schema and scaffolding for changes tracking  

---

## Tech Stack

- Next.js 13 (App Router)  
- TypeScript  
- Prisma ORM with SQLite database  
- Zod for schema validation  
- JWT-based demo authentication  
- Git for version control  

---

## Setup Instructions

1. Clone the repository:  
git clone https://github.com/NamanSrivas/Buyer-Lead-Intake.git
cd Buyer-Lead-Intake


2. Install dependencies:
   npm install

3. Set up Prisma database and run migrations:  

npx prisma migrate dev --name init


4. Run the development server:  

npm run dev


5. Open [http://localhost:3000/login](http://localhost:3000/login) in your browser and login with email:  

   
6. Use the app to create, view, edit leads, and import/export CSV files.

---

## Design Notes

- Validation is centralized with Zod schemas shared on client and server (`lib/schema.ts`).  
- Authentication is handled with a demo login issuing JWT tokens stored as cookies (`lib/auth.ts`).  
- Ownership is checked in API routes based on user id extracted from JWT token.  
- Pagination and filters are applied server-side in API routes for efficiency.  
- Concurrency control is scaffolded by requiring `updatedAt` timestamp for updates.  
- CSV import is transactional with per-row validation and error reporting.  
- Frontend built with React server and client components under Next.js App Router.  

---

## What’s Done & What’s Left

**Completed:**  
- All core CRUD features with validation and ownership  
- Demo authentication and login flow  
- CSV import/export API and UI  
- Pagination, debounced search, filtering URL sync  
- Code quality with TypeScript and clear organization  

**Partial / To Do:**  
- Display and UI for buyer change history  
- Concurrency conflict user-friendly errors and retries  
- Rate limiting on APIs to reduce abuse  
- Unit and integration tests for validation and APIs  
- Accessibility improvements  

---

## Deployment

This app can be deployed on Vercel or any platform supporting Next.js 13. Just connect your GitHub repo and set up environment variables.

---

## License

This project is licensed under MIT License.

---

## Contact

For issues or questions, please open a GitHub issue on the repository.
