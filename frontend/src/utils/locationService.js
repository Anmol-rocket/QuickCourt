// Location service for getting user's current location and city
export class LocationService {
  static async getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  static async getCityFromCoordinates(latitude, longitude) {
    try {
      // Using OpenStreetMap Nominatim API (free reverse geocoding)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }

      const data = await response.json();
      
      // Extract city name from the response
      const address = data.address || {};
      const city = address.city || 
                   address.town || 
                   address.village || 
                   address.county || 
                   address.state_district ||
                   'Unknown City';
      
      return {
        city,
        fullAddress: data.display_name || 'Unknown Location',
        country: address.country || 'Unknown Country',
        state: address.state || 'Unknown State',
        // Additional location components for better matching
        suburb: address.suburb || null,
        neighbourhood: address.neighbourhood || null,
        district: address.city_district || address.district || null,
        region: address.region || null,
        postcode: address.postcode || null
      };
    } catch (error) {
      console.error('Error getting city from coordinates:', error);
      throw error;
    }
  }

  static async getUserCity() {
    try {
      const coords = await this.getUserLocation();
      const locationData = await this.getCityFromCoordinates(coords.latitude, coords.longitude);
      return locationData;
    } catch (error) {
      console.error('Error getting user city:', error);
      throw error;
    }
  }

  static saveUserCity(cityData) {
    try {
      localStorage.setItem('userCity', JSON.stringify(cityData));
      localStorage.setItem('userCityTimestamp', Date.now().toString());
    } catch (error) {
      console.error('Error saving user city:', error);
    }
  }

  static getUserCityFromStorage() {
    try {
      const cityData = localStorage.getItem('userCity');
      const timestamp = localStorage.getItem('userCityTimestamp');
      
      if (!cityData || !timestamp) {
        return null;
      }

      // Check if the stored city data is older than 24 hours
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(timestamp) > twentyFourHours) {
        localStorage.removeItem('userCity');
        localStorage.removeItem('userCityTimestamp');
        return null;
      }

      return JSON.parse(cityData);
    } catch (error) {
      console.error('Error getting user city from storage:', error);
      return null;
    }
  }
}
