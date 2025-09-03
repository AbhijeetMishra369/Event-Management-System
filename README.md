# Event Management System

A comprehensive web-based platform for creating events, managing ticket sales, and generating QR-code tickets for attendees. This system streamlines the entire event management and ticket distribution process.

## 🚀 Features

### For Event Organizers
- **Event Creation**: Create and configure events with details like date, venue, and ticket types
- **Ticket Management**: Set multiple ticket types with different prices and availability
- **Sales Dashboard**: Monitor ticket sales, revenue, and attendance metrics
- **QR Code Generation**: Automatic QR code generation for each ticket
- **Real-time Analytics**: Track sales performance and attendee data

### For Attendees
- **Event Discovery**: Browse and search for available events
- **Ticket Purchase**: Easy ticket selection and secure payment processing
- **Digital Tickets**: Receive QR code tickets via email/mobile
- **Event Reminders**: Get notifications about upcoming events

### For Event Staff
- **QR Code Validation**: Scan and validate tickets at event entry
- **Manual Entry**: Fallback option for ticket number input
- **Duplicate Prevention**: System prevents duplicate ticket usage
- **Real-time Status**: Instant validation feedback

## 🏗️ Architecture

### Backend (Spring Boot + MongoDB)
- **RESTful APIs**: Complete CRUD operations for events, tickets, and users
- **MongoDB**: NoSQL database for flexible data storage
- **Spring Security**: JWT-based authentication and authorization
- **QR Code Generation**: Dynamic QR code creation for tickets
- **Email Service**: Automated ticket delivery and notifications

### Frontend (React)
- **Modern UI**: Beautiful, responsive design with Material-UI
- **Real-time Updates**: Live dashboard updates and notifications
- **Mobile Responsive**: Optimized for all device sizes
- **QR Code Scanner**: Built-in scanner for ticket validation

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.x**: Main framework
- **Spring Security**: Authentication & authorization
- **Spring Data MongoDB**: Database operations
- **Maven**: Dependency management
- **JWT**: Token-based authentication
- **QR Code Library**: Ticket generation

### Frontend
- **React 18**: UI framework
- **Material-UI**: Component library
- **Axios**: HTTP client
- **React Router**: Navigation
- **QR Code Scanner**: Ticket validation

### Database
- **MongoDB**: Primary database
- **MongoDB Compass**: Database management (optional)

## 📋 Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- MongoDB 5.0 or higher
- Maven 3.6 or higher

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
mvn clean install
# Dev profile uses in-memory MongoDB (no external Mongo needed)
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend Setup
```bash
cd frontend
npm install
# Point frontend to backend API
echo "REACT_APP_API_URL=http://localhost:8080/api" > .env.local
npm start
```

### Database Setup
- Dev profile: No setup required (embedded in-memory MongoDB)
- Production: Use MongoDB 5+, set `spring.data.mongodb.*` in `application.properties` or env vars.

## 📁 Project Structure

```
event-management-system/
├── backend/                 # Spring Boot application
│   ├── src/main/java/
│   │   └── com/eventmanagement/
│   │       ├── controller/  # REST controllers
│   │       ├── service/     # Business logic
│   │       ├── repository/  # Data access
│   │       ├── model/       # Data models
│   │       ├── config/      # Configuration
│   │       └── security/    # Security configuration
│   └── pom.xml
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── package.json
└── README.md
```

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (Organizer, Attendee, Staff)
- Secure password hashing
- CORS configuration
- Input validation and sanitization

## 📊 API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/{id}` - Get event by ID
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event

### Tickets
- `GET /api/tickets` - Get user tickets
- `POST /api/tickets/purchase` - Purchase ticket
- `GET /api/tickets/{id}/qr` - Get ticket QR code
- `POST /api/tickets/validate` - Validate ticket

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please open an issue in the repository.
