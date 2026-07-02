🌤️ Weather Pulse - API Integration

**Company Name:** CODTECH IT Solutions  

**Intern Name:** PRIYANSU PRADHAN 

**Intern ID:** CTIS9331

**Domain:** Full Stack Web Development  

**Batch Duration:** 8 WEEK 

**Mentor Name:** Nila Santos

📌 Project Description

This project is a Weather Web Application developed as part of my internship at CODTECH IT Solutions. The application fetches real-time weather data from a public API and displays it in a clean, responsive interface. Users can search for any city in the world or use their current GPS location to get live weather information including temperature, humidity, wind speed, and a 5-day forecast.


🛠️ Tools and Technologies Used

The entire project was developed using Visual Studio Code (VS Code) as the primary code editor. The frontend is built using HTML5, CSS3, and plain JavaScript without any frontend framework. The application uses the OpenWeatherMap API to fetch live weather data. Google Fonts (Poppins) has been used for clean typography. The UI follows a Glassmorphism design approach with smooth animations and dynamic gradient backgrounds.


⚙️ How the Application Works

When a user opens the application, the browser automatically requests geolocation permission. If granted, the app fetches weather data for the user's current coordinates using the OpenWeatherMap Current Weather and 5-Day Forecast endpoints.

Users can also manually search for any city by typing its name in the search bar and pressing Enter or clicking the Search button. The app sends an API request to OpenWeatherMap, receives the JSON response, and dynamically updates the UI with the latest weather data.

The background gradient changes based on the current weather condition — orange for sunny, blue for rainy, grey for cloudy, and so on — making the experience visually intuitive.

A unit toggle allows users to switch between Celsius and Fahrenheit instantly. The 5-day forecast section displays daily weather summaries with icons and min/max temperatures. A loading spinner appears while data is being fetched, and meaningful error messages are shown if a city is not found or the API key is missing.


🌍 Where This Project is Applicable

Weather applications like this one have wide real-world use cases. Travel platforms can integrate weather data to help users plan trips better. Agriculture apps can use forecast data to help farmers make decisions about irrigation and crop protection. E-commerce and logistics platforms can use weather APIs to manage delivery schedules.

Event management platforms can use real-time weather data to plan outdoor events. News websites can embed live weather widgets for their local audiences. Educational platforms can use it to teach students about APIs, JSON, and asynchronous JavaScript in a practical context.

The API integration pattern used in this project — fetch, parse JSON, handle errors, and update DOM — is the foundation of almost every modern web application that communicates with external services.


✨ Features


🔍 Search weather by city name
📍 Auto-detect user location via Geolocation API
🌡️ Toggle between Celsius and Fahrenheit
📅 5-Day weather forecast with icons
💨 Humidity, wind speed, and "feels like" data
🎨 Dynamic background based on weather condition
⏳ Loading spinner and error handling
📱 Fully responsive — works on mobile and desktop



🔑 Setup Instructions


Clone or download this repository
Go to openweathermap.org and create a free account
Copy your API key from the API Keys section
Open weather-app.js and replace line 1:


jsconst apiKey = 'YOUR_API_KEY'; // Replace with your key


Open weather-app.html in your browser
Done! 🎉



⚠️ New API keys take 10–15 minutes to activate after signup.




📁 Project Structure

weather-app/
│
├── weather-app.html      # Main HTML structure
├── weather-app.css       # Styling with glassmorphism UI
├── weather-app.js        # API calls and DOM logic
└── README.md             # Project documentation




📚 API Reference

EndpointUsage/data/2.5/weatherCurrent weather by city or coordinates/data/2.5/forecast5-day forecast (3-hour intervals)

Base URL: https://api.openweathermap.org
