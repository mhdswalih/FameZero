// src/hooks/useCurrentLocation.ts
import { useEffect, useState } from "react";
import axios from "axios";

export interface LatLon {
  lat: number;
  lon: number;
}

export interface LocationInfo {
  lat: number;
  lon: number;
  source: "browser" | "ip";
  accuracy?: number | null; // in meters (when available from browser)
  city?: string;
  region?: string;
  country?: string;
  ip?: string;
  timezone?: string;
}

export function useCurrentLocation() {
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let didCancel = false;

    async function fallbackToIP() {
      try {
        const res = await axios.get("https://apiip.net/api/check", {
          params: { accessKey: "81b33d70-9882-48f9-af27-15d9a757c561" }, 
        });

        if (didCancel) return;

        const d = res.data;

        if (!d) {
          setError("IP lookup returned no data");
          setLoading(false);
          return;
        }

        setLocation({
          lat: Number(d.latitude),
          lon: Number(d.longitude),
          source: "ip",
          city: d.city,
          region: d.region_name,     // correct field from apiip.net
          country: d.country_name,   // correct field from apiip.net
          ip: d.ip,
          timezone: d.timezone,
        });
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message || "IP lookup failed");
      } finally {
        setLoading(false);
      }
    }

    // First try browser geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (didCancel) return;

          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            source: "browser",
            accuracy: pos.coords.accuracy,
          });
          setLoading(false);
        },
        (geoError) => {
          console.warn("Browser geolocation failed:", geoError);
          fallbackToIP();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // 10 seconds
          maximumAge: 0,
        }
      );
    } else {
      // Browser does not support geolocation, fallback to IP
      fallbackToIP();
    }

    return () => {
      didCancel = true;
    };
  }, []);

  return { location, loading, error };
}
