"use client";

import { useCallback, useState } from "react";

export const useApiState = (initialValue = null) => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = useCallback(async (handler) => {
    setLoading(true);
    setError("");
    try {
      const response = await handler();
      setData(response);
      return response;
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Request failed");
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, setData, loading, error, setError, run };
};
