#!/bin/bash

echo "🚀 Setting up Event Management System..."

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven 3.6 or higher."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
mvn clean install -DskipTests
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Setup completed successfully!"
echo ""
echo "🎉 To run the application:"
echo ""
echo "1. Start MongoDB (make sure it's running on localhost:27017)"
echo "2. Start the backend:"
echo "   cd backend && mvn spring-boot:run"
echo ""
echo "3. Start the frontend (in a new terminal):"
echo "   cd frontend && npm start"
echo ""
echo "🌐 The application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8080/api"
echo ""
echo "📝 Don't forget to:"
echo "   - Configure your email settings in backend/src/main/resources/application.properties"
echo "   - Update the JWT secret in production"
echo "   - Set up your MongoDB database"