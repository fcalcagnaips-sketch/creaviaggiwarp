# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Travel Planner is a client-side web application for organizing trips based on departure/arrival cities, dates, number of people, and budget per person. The application is built with vanilla HTML, CSS, and JavaScript using a simple class-based architecture.

## Development Commands

### Setup and Installation
```bash
npm install
```

### Development Server
```bash
npm run dev          # Start live-server on port 3000 and open in browser
npm start            # Alternative start command (same as dev)
```

### Direct Development
Since this is a static web app, you can also:
- Open `index.html` directly in a browser for basic testing
- Use any static file server (e.g., `python -m http.server 8000`)
- **XAMPP**: Access via `http://localhost/creaviaggi/` (recommended for API features)

### API Configuration
```bash
# Configure API keys for enhanced features
# Edit js/api-config.js with your API keys
# See API_SETUP.md for detailed instructions
```

## Architecture Overview

### Application Structure
The application follows a modular architecture with API service integration:

- **TravelPlanner Class**: Main application controller that handles form validation, event management, and trip calculations
- **API Service Layer**: Modular services for external data (geocoding, weather, currency, travel)
- **Event-Driven Architecture**: Uses DOM events for user interactions and form validation
- **Local Storage Integration**: Persists trip data locally for user convenience
- **ES6 Modules**: Modern module system for clean code organization

### Key Components

#### TravelPlanner Class (`js/app.js`)
- **Form Management**: Handles form submission, validation, and reset functionality
- **Real-time Validation**: Validates fields on blur/input events with Italian error messages
- **Date Logic**: Enforces date constraints (no past dates, return after departure)
- **Budget Calculations**: Computes total budget based on people count and per-person budget
- **Results Display**: Dynamically updates results section with formatted trip summary
- **Persistence**: Saves/loads trip data to/from localStorage with expiration (30 days)

#### Validation System
- Field-level validation with immediate feedback
- Custom error styling and messaging in Italian
- Cross-field validation (e.g., return date must be after departure)
- Maximum constraints (20 people limit)

#### UI/UX Features
- Responsive design with mobile-first approach
- Smooth scrolling and animations
- Gradient backgrounds and modern styling
- Italian locale formatting for dates and currency

### File Structure
```
travel-planner/
├── index.html              # Main HTML with trip form and results display
├── css/style.css          # Complete styling with responsive design
├── js/
│   ├── app.js            # Main TravelPlanner class with API integration
│   ├── api-config.js     # API endpoints and configuration
│   └── services/         # Modular API services
│       ├── geocoding-service.js    # City search and coordinates
│       ├── weather-service.js      # Weather data integration
│       ├── currency-service.js     # Currency conversion
│       └── travel-services.js      # Flight and hotel data
├── API_SETUP.md           # API configuration guide
├── package.json          # Development dependencies
└── WARP.md              # This documentation file
```

### Italian Localization
- All user-facing text is in Italian
- Date formatting uses Italian locale (`it-IT`)
- Currency formatting in EUR
- Form validation messages in Italian
- Semantic HTML with Italian labels and placeholders

## API Integration

### Available Services
- **GeocodingService**: City search, coordinates, distance calculations
- **WeatherService**: Current weather and forecasts for destinations  
- **CurrencyService**: Real-time exchange rates and conversions
- **FlightService**: Flight search (mock data, extensible for real APIs)
- **HotelService**: Hotel search (mock data, extensible for real APIs)
- **CountryService**: Country information and metadata

### API Configuration
- Edit `js/api-config.js` to add your API keys
- See `API_SETUP.md` for detailed setup instructions
- Most services work with fallback data when APIs are unavailable
- OpenWeatherMap API key recommended for weather features

### Rate Limiting
- Built-in rate limiting to respect API quotas
- Intelligent caching to minimize API calls
- Graceful fallbacks when rate limits are exceeded

## Development Notes

### Adding Features
- Extend the `TravelPlanner` class for new functionality
- Create new service classes in `js/services/` for external data
- Use the existing validation pattern for new form fields
- Follow the Italian localization for any user-facing text
- Maintain the existing CSS class naming conventions

### Form Validation
- Use `validateField()` method pattern for new fields
- Error styling is handled automatically via `showFieldError()` and `clearFieldError()`
- Validation messages should be in Italian and user-friendly

### Styling Guidelines
- CSS uses CSS Grid and Flexbox for layouts
- Color scheme: Primary (#667eea), gradients for backgrounds
- Mobile-first responsive design with breakpoints at 768px and 480px
- Use existing CSS custom properties pattern if adding new colors

### Data Management
- Trip data is automatically saved to localStorage with 30-day expiration
- Use the `currentTrip` property for accessing active trip data
- Follow the existing data structure for consistency

### API Service Development
- Add new services to `js/services/` directory
- Follow the existing service pattern with caching and error handling
- Import and initialize services in the main `TravelPlanner` constructor
- Use async/await for API calls with proper error handling

### Browser Compatibility
- Uses modern JavaScript (ES6+ modules, classes, async/await)
- CSS Grid and Flexbox (IE11+ support not guaranteed)
- Fetch API for HTTP requests (modern browsers)
- LocalStorage API for data persistence
- ES6 module system requires server environment (XAMPP recommended)
