import { useState, useEffect, useRef } from 'react';
import { createFuseIndex, searchCountries } from '../utils/fuzzySearch';

/**
 * Hook to load and index country data for autocomplete
 */
export default function useCountryData() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fuseRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/countries.json');
        if (!res.ok) throw new Error('Failed to load country data');
        const data = await res.json();
        setCountries(data);

        const { fuse, processed } = createFuseIndex(data);
        fuseRef.current = fuse;
        setCountries(processed);
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    }
    load();
  }, []);

  const search = (query) => {
    if (!fuseRef.current) return [];
    return searchCountries(fuseRef.current, query);
  };

  return { countries, loading, error, search };
}
