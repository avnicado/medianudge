# MediaNudge - Social Learning Platform

MediaNudge is a social media platform designed to cultivate education, wisdom, and meaningful engagement. Track your intellectual growth, discover quality content, and connect with others based on shared learning goals.

## Features

- **Content Discovery**: Browse books, courses, podcasts, movies, debates, and games
- **Rating System**: Rate content on a 1-5 star scale (1★ = brainrot, 5★ = mind-expanding)
- **Progress Tracking**: Monitor your learning journey and yearly goals
- **Social Features**: Follow other users and view their public profiles
- **Admin Interface**: Content management tools for administrators
- **No Authentication Required**: Fully accessible platform without login barriers

## Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed
- No sudo privileges required

### Running the Application

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd medianudge
   ```

2. **Quick start with troubleshooting**:
   ```bash
   # Run the troubleshooting script
   ./docker-troubleshoot.sh
   ```

3. **Manual startup**:
   ```bash
   # Start the application
   docker-compose up -d
   
   # Check if it's running
   docker-compose ps
   
   # View logs if there are issues
   docker-compose logs -f
   ```

4. **Access the application**:
   - Web application: http://localhost:3000
   - PostgreSQL database: localhost:5432

5. **Stop the application**:
   ```bash
   docker-compose down
   ```

### Development Mode

To run in development mode with hot reload:

```bash
docker-compose --profile dev up -d
```

This will start the development server on http://localhost:3001

### Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (database data)
docker-compose down -v

# Rebuild containers
docker-compose build --no-cache

# Access database
docker-compose exec postgres psql -U medianudge -d medianudge
```

## Configuration

### Environment Variables

The application uses these environment variables (automatically configured in docker-compose.yml):

- `NODE_ENV`: Application environment (development/production)
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret key for session encryption
- `PGDATABASE`: PostgreSQL database name
- `PGHOST`: PostgreSQL host
- `PGPORT`: PostgreSQL port
- `PGUSER`: PostgreSQL username
- `PGPASSWORD`: PostgreSQL password

### Database

The application uses PostgreSQL with the following default credentials:

- Database: `medianudge`
- Username: `medianudge`
- Password: `medianudge_password`
- Port: `5432`

**Note**: Change these credentials for production use.

## Project Structure

```
medianudge/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Express backend
│   ├── index.ts           # Main server file
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── db.ts              # Database connection
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema definitions
├── Dockerfile             # Production container
├── Dockerfile.dev         # Development container
├── docker-compose.yml     # Docker services configuration
└── init-db.sql           # Database initialization
```

## API Endpoints

### Public Endpoints

- `GET /api/health` - Health check
- `GET /api/media` - Get media items
- `GET /api/media/:id` - Get specific media item
- `GET /api/recommendations` - Get recommendations by type
- `GET /api/search` - Search media items
- `GET /api/weekly-challenge` - Get current weekly challenge
- `GET /api/top-users` - Get top users by wisdom score

### Admin Endpoints

- `POST /api/admin/media` - Create new media item
- `DELETE /api/admin/media/:id` - Delete media item

## Development

### Local Development (without Docker)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Start database** (if not using Docker):
   ```bash
   # Install PostgreSQL and create database
   createdb medianudge
   ```

4. **Run database migrations**:
   ```bash
   npm run db:push
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Containerization**: Docker, Docker Compose
- **Build Tools**: Vite, ESBuild

## Security Notes

- No authentication system required - fully open platform
- Session management configured for secure cookie handling
- Database credentials should be changed for production
- Health checks enabled for container monitoring
- Non-root user configured in Docker containers

## Troubleshooting

### Automated Troubleshooting

Run the troubleshooting script to automatically diagnose and fix common issues:

```bash
./docker-troubleshoot.sh
```

### Common Issues

1. **Connection Refused Error**:
   ```bash
   # Check if containers are running
   docker-compose ps
   
   # Restart containers
   docker-compose down && docker-compose up -d
   
   # Check application logs
   docker-compose logs app
   ```

2. **Port conflicts**: 
   ```bash
   # Check what's using port 3000
   lsof -i :3000
   
   # Kill process or change port in docker-compose.yml
   ```

3. **Database connection issues**:
   ```bash
   # Check PostgreSQL logs
   docker-compose logs postgres
   
   # Connect to database directly
   docker-compose exec postgres psql -U medianudge -d medianudge
   ```

4. **Authentication errors**: The app disables authentication in Docker mode automatically

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs app
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f app

# Check container health
docker-compose ps
```

### Manual Debugging

```bash
# Enter the app container
docker-compose exec app sh

# Check environment variables
docker-compose exec app env

# Test health endpoint
curl http://localhost:3000/api/health

# Rebuild containers from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Database Access

```bash
# Connect to database
docker-compose exec postgres psql -U medianudge -d medianudge

# View tables
\dt

# View sample data
SELECT * FROM media_items LIMIT 5;
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

## License

MIT License - see LICENSE file for details