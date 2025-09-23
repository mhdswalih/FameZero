// src/hooks/useDistanceCalculation.ts
import { useCallback } from "react";
import { LatLon } from "../LocationHooks/CurrentLocation";

export interface HotelWithDistance {
  _id: string;
  userId: string;
  name: string;
  email: string;
  profilepic: string;
  location: string;
  city: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
}

export function useDistanceCalculation() {
  // Improved distance calculation with validation
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    // Validate coordinates
    if (!lat1 || !lon1 || !lat2 || !lon2 || 
        isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2) ||
        Math.abs(lat1) > 90 || Math.abs(lon1) > 180 || 
        Math.abs(lat2) > 90 || Math.abs(lon2) > 180) {
      console.error("Invalid coordinates:", { lat1, lon1, lat2, lon2 });
      return Infinity;
    }
    
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
  }, []);

  // Function to get coordinates from city name (fallback)
  const getCoordinatesFromCity = useCallback((city: string) => {
    // Simple mapping of cities to coordinates - you might want to expand this
    const cityCoordinates: Record<string, {lat: number, lon: number}> = {
      "kondotty": { lat: 11.1445, lon: 75.9630 },
      "kochi": { lat: 9.9312, lon: 76.2673 },
      "trivandrum": { lat: 8.5241, lon: 76.9366 },
      "kozhikode": { lat: 11.2588, lon: 75.7804 },
      "kannur": { lat: 11.8745, lon: 75.3704 },
      "malappuram": { lat: 11.0732, lon: 76.0730 },
      "thrissur": { lat: 10.5276, lon: 76.2144 },
      "palakkad": { lat: 10.7867, lon: 76.6548 },
      "alappuzha": { lat: 9.4981, lon: 76.3388 },
      "kollam": { lat: 8.8932, lon: 76.6141 },
    };
    
    const normalizedCity = city.toLowerCase().trim();
    return cityCoordinates[normalizedCity] || null;
  }, []);

  // Calculate distances for all hotels
  const calculateDistancesForHotels = useCallback((
    hotels: HotelWithDistance[],
    userLocation: LatLon | null
  ): HotelWithDistance[] => {
    if (!userLocation) return hotels;

    return hotels.map(hotel => {
      let hotelLat = hotel.latitude;
      let hotelLon = hotel.longitude;
      
      // If hotel doesn't have coordinates, try to get them from city name
      if (!hotelLat || !hotelLon) {
        const coords = getCoordinatesFromCity(hotel.city);
        if (coords) {
          hotelLat = coords.lat;
          hotelLon = coords.lon;
        } else {
          // If we can't get coordinates, skip distance calculation
          return { ...hotel, distance: undefined };
        }
      }
      
      // Calculate distance only if we have valid coordinates
      if (hotelLat && hotelLon) {
        const distance = calculateDistance(
          userLocation.lat, 
          userLocation.lon, 
          hotelLat, 
          hotelLon
        );
        return { ...hotel, distance };
      }
      
      return { ...hotel, distance: undefined };
    });
  }, [calculateDistance, getCoordinatesFromCity]);

  return {
    calculateDistance,
    getCoordinatesFromCity,
    calculateDistancesForHotels
  };
}
