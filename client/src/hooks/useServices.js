import { useState, useEffect, useCallback } from "react";
import axios from "../api/axios";

export function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/services");
      setServices(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || "Ошибка загрузки услуг");
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, loading, error, refetch: fetchServices };
}
