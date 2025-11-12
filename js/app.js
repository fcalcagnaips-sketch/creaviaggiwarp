// Travel Planner JavaScript Application
import { GeocodingService, CountryService } from './services/geocoding-service.js';
import { WeatherService } from './services/weather-service.js';
import { CurrencyService } from './services/currency-service.js';
import { FlightService, HotelService } from './services/travel-services.js';

class TravelPlanner {
    constructor() {
        this.form = document.getElementById('travelForm');
        this.resultsSection = document.getElementById('results');
        this.resetBtn = document.getElementById('resetBtn');
        
        // Initialize API services
        this.geocodingService = new GeocodingService();
        this.countryService = new CountryService();
        this.weatherService = new WeatherService();
        this.currencyService = new CurrencyService();
        this.flightService = new FlightService();
        this.hotelService = new HotelService();
        
        this.initEventListeners();
        this.setMinDates();
    }

    initEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.resetBtn.addEventListener('click', () => this.resetForm());
        
        // Add real-time validation
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Date validation
        const departureDate = document.getElementById('departureDate');
        const returnDate = document.getElementById('returnDate');
        
        departureDate.addEventListener('change', () => {
            returnDate.min = departureDate.value;
            if (returnDate.value && returnDate.value < departureDate.value) {
                returnDate.value = departureDate.value;
            }
        });
    }

    setMinDates() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('departureDate').min = today;
        document.getElementById('returnDate').min = today;
    }

    validateField(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        this.clearFieldError(input);

        switch (input.type) {
            case 'text':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Questo campo è obbligatorio';
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Inserisci almeno 2 caratteri';
                }
                break;

            case 'date':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Seleziona una data';
                } else {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    if (selectedDate < today) {
                        isValid = false;
                        errorMessage = 'La data non può essere nel passato';
                    }
                }
                break;

            case 'number':
                if (!value || parseFloat(value) <= 0) {
                    isValid = false;
                    errorMessage = 'Inserisci un valore valido maggiore di 0';
                } else if (input.id === 'numberOfPeople' && parseInt(value) > 20) {
                    isValid = false;
                    errorMessage = 'Massimo 20 persone';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(input, errorMessage);
        }

        return isValid;
    }

    showFieldError(input, message) {
        input.style.borderColor = '#dc3545';
        input.style.backgroundColor = '#fff5f5';
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        
        input.parentNode.appendChild(errorDiv);
    }

    clearFieldError(input) {
        input.style.borderColor = '#e1e5e9';
        input.style.backgroundColor = '#fafbfc';
        
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const inputs = this.form.querySelectorAll('input[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        // Additional validation for date range
        const departureDate = new Date(document.getElementById('departureDate').value);
        const returnDate = new Date(document.getElementById('returnDate').value);
        
        if (returnDate <= departureDate) {
            isFormValid = false;
            this.showFieldError(
                document.getElementById('returnDate'),
                'La data di ritorno deve essere successiva alla partenza'
            );
        }

        if (isFormValid) {
            this.processTrip();
        } else {
            // Scroll to first error
            const firstError = this.form.querySelector('.error-message');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    async processTrip() {
        // Get form data
        const formData = new FormData(this.form);
        const tripData = Object.fromEntries(formData.entries());
        
        // Calculate trip details
        const departureDate = new Date(tripData.departureDate);
        const returnDate = new Date(tripData.returnDate);
        const duration = Math.ceil((returnDate - departureDate) / (1000 * 60 * 60 * 24));
        const numberOfPeople = parseInt(tripData.numberOfPeople);
        const budgetPerPerson = parseFloat(tripData.budgetPerPerson);
        const totalBudget = numberOfPeople * budgetPerPerson;

        // Format dates in Italian
        const formatDate = (date) => {
            return date.toLocaleDateString('it-IT', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        };

        // Update basic results
        document.getElementById('itinerary').textContent = 
            `${tripData.departureCity} → ${tripData.arrivalCity}`;
        document.getElementById('duration').textContent = 
            `${duration} ${duration === 1 ? 'giorno' : 'giorni'} (${formatDate(departureDate)} - ${formatDate(returnDate)})`;
        document.getElementById('travelers').textContent = 
            `${numberOfPeople} ${numberOfPeople === 1 ? 'persona' : 'persone'}`;
        document.getElementById('budgetPp').textContent = 
            `€${budgetPerPerson.toFixed(2)}`;
        document.getElementById('totalBudget').textContent = 
            `€${totalBudget.toFixed(2)}`;

        // Show results section first
        this.resultsSection.classList.remove('hidden');
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });

        // Load additional data with API services
        await this.loadTravelData(tripData);

        // Store trip data for potential future use
        this.currentTrip = {
            ...tripData,
            duration,
            totalBudget,
            calculatedAt: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('lastTrip', JSON.stringify(this.currentTrip));
    }

    async loadTravelData(tripData) {
        try {
            // Get destination coordinates and weather
            const destinationCoords = await this.geocodingService.getCityCoordinates(tripData.arrivalCity);
            
            if (destinationCoords) {
                // Load weather data
                const weather = await this.weatherService.getCurrentWeather(
                    destinationCoords.lat, 
                    destinationCoords.lon
                );
                
                if (weather) {
                    this.displayWeatherInfo(weather);
                } else {
                    this.displayWeatherInfo(null, 'Informazioni meteo non disponibili');
                }
            } else {
                this.displayWeatherInfo(null, 'Coordinate destinazione non trovate');
            }
            
        } catch (error) {
            console.error('Errore caricamento dati viaggio:', error);
            this.displayWeatherInfo(null, 'Errore caricamento dati meteo');
        }
    }

    displayWeatherInfo(weather, errorMessage = null) {
        const weatherNow = document.getElementById('weatherNow');
        const weatherTemp = document.getElementById('weatherTemp');
        const weatherHumidity = document.getElementById('weatherHumidity');
        
        if (errorMessage || !weather) {
            weatherNow.textContent = errorMessage || 'Dati non disponibili';
            weatherTemp.textContent = '-';
            weatherHumidity.textContent = '-';
            return;
        }
        
        const description = weather.weather[0].description;
        const temperature = Math.round(weather.main.temp);
        const humidity = weather.main.humidity;
        
        weatherNow.textContent = description.charAt(0).toUpperCase() + description.slice(1);
        weatherTemp.textContent = `${temperature}°C`;
        weatherHumidity.textContent = `${humidity}%`;
    }

    resetForm() {
        // Reset form
        this.form.reset();
        
        // Clear all errors
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => this.clearFieldError(input));
        
        // Hide results
        this.resultsSection.classList.add('hidden');
        
        // Reset min dates
        this.setMinDates();
        
        // Clear stored data
        this.currentTrip = null;
        localStorage.removeItem('lastTrip');
        
        // Focus on first input
        document.getElementById('departureCity').focus();
    }

    // Method to load previous trip from localStorage
    loadLastTrip() {
        const lastTrip = localStorage.getItem('lastTrip');
        if (lastTrip) {
            try {
                const tripData = JSON.parse(lastTrip);
                
                // Check if the trip is not too old (e.g., within 30 days)
                const calculatedAt = new Date(tripData.calculatedAt);
                const now = new Date();
                const daysDiff = (now - calculatedAt) / (1000 * 60 * 60 * 24);
                
                if (daysDiff <= 30) {
                    return tripData;
                }
            } catch (e) {
                console.warn('Invalid trip data in localStorage');
            }
        }
        return null;
    }
}

// Utility functions
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
};

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new TravelPlanner();
    
    // Optional: Load last trip if available
    const lastTrip = app.loadLastTrip();
    if (lastTrip) {
        console.log('Last trip data available:', lastTrip);
        // You could show a notification or auto-fill some fields here
    }
    
    console.log('🌍 Travel Planner loaded successfully!');
});
