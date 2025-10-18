# 🚗 Car Lending Platform

A comprehensive car lending platform built with Next.js 15, TypeScript, and Supabase. This platform enables users to register, list vehicles, make bookings, and engage in offer/counteroffer negotiations.

## 🎯 Features

- **User Management**: Enhanced user profiles with company details
- **Vehicle Management**: Complete vehicle listing and management system
- **Booking System**: Support for both registered and guest bookings
- **Offer System**: Negotiation system with offers and counteroffers
- **Modern UI**: Built with Tailwind CSS for a responsive design
- **Type Safety**: Full TypeScript support throughout the application
- **Database**: Supabase PostgreSQL with comprehensive schema
- **API Routes**: RESTful API endpoints for all operations

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Development**: ESLint, TypeScript, tsx

## Getting Started

### Prerequisites

- Node.js 18+ 
- MySQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd eg-b2b-lending
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env.local` file with your Supabase credentials (see step 4)


4. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your project URL and API keys
   - Create a `.env.local` file with your Supabase credentials
   - Run the SQL schema from `SUPABASE_SETUP.md` in your Supabase SQL editor

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Loan Applications
- `GET /api/loans` - Get all loan applications
- `POST /api/loans` - Create a new loan application
- `GET /api/loans/[id]` - Get loan application by ID
- `PUT /api/loans/[id]` - Update loan application
- `DELETE /api/loans/[id]` - Delete loan application

## Database Schema

The application uses the following main entities:

- **User**: Stores user information (name, email, company)
- **LoanApplication**: Stores loan application details (amount, purpose, status)
- **LoanStatus**: Enum for loan status (PENDING, APPROVED, REJECTED, UNDER_REVIEW)

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   │   ├── users/     # User endpoints
│   │   └── loans/     # Loan endpoints
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── components/        # React components
│   ├── UsersList.tsx
│   ├── UserForm.tsx
│   ├── LoansList.tsx
│   └── LoanForm.tsx
└── lib/
    ├── supabase.ts    # Supabase client
    └── api.ts         # API utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
