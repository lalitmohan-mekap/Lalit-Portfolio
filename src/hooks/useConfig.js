import { useState, useEffect } from 'react';
import { config as defaultConfig } from '../data/config';

export const useConfig = () => {
  const [config, setConfig] = useState(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Cache buster to ensure we get the latest config, especially after edits
        const cacheBuster = new Date().getTime();
        const response = await fetch(`./data/config.json?v=${cacheBuster}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setConfig(data);
      } catch (e) {
        console.error("Failed to fetch config, falling back to default:", e);
        setError(e);
        // We already have defaultConfig loaded initially
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, isLoading, error };
};
