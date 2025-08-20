# Wanderly

🚧 **Status: Early Development** 🚧  
This project is in the early stages of development. Features, structure, and implementation details are subject to change.  

## Overview
**Wanderly** is a web application that generates personalized travel itineraries using AI. It aims to help travelers save time by providing customized trip plans for solo, couple, or family trips.  

## Features (Planned)
- **User Accounts & Authentication** (JWT, OAuth with Google/GitHub)  
- **Subscription Plans** (Free & Paid, managed via Stripe)  
- **Trip Planner**: Input trip type, location, dates, preferences → receive AI-generated itinerary  
- **Dashboard** to view, save, and manage trips  
- **Secure Storage** of itineraries in a database  

## Tech Stack

### Frontend
- **React 19** + **TypeScript**  
- **Zustand** (state management)  
- **Tanstack Router** (routing)  
- **React Query + Axios** (API calls)  
- **Zod + React Hook Form** (validation & forms)  
- **ShadcnUI + Framer Motion** (UI components & animations)  
- **Vitest**(testing)  
- **Vercel** (deployment)  

### Backend (API Gateway)
- **NestJS** (Node.js + TypeScript)  
- **PostgreSQL** + **Prisma** (ORM)  
- **JWT + Passport** (authentication)  
- **Stripe SDK** (payments)  
- **Swagger** (API documentation)  
- **Dockerized** for local development  
- Deployment: **Railway / Render**  

### AI Microservice
- **FastAPI** 
- **LangChain + Gemini SDK** (AI itinerary generation)  
- **Pydantic** (validation)  
- **Stateless service** (persistence handled by backend)  
- **Dockerized** for local development  
- Deployment: **Railway**  

### Infrastructure
- **Docker + Docker Compose**  
- **PostgreSQL** (database)  
- **Dbeaver** (database GUI)  
- (Future) **RabbitMQ** for async processing  
- **Sentry / Datadog** (logging & monitoring)  

## Development Status
- ✅ Architecture defined  
- 🚧 Core services being scaffolded  
- 🛠️ Frequent updates and breaking changes expected  

## Contributing
Contributions are welcome once the foundation is more stable. For now, feedback and ideas are appreciated.  

## License
This project is currently **unlicensed** while in development.  

