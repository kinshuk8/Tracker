import { useState, useEffect } from 'react';

// Global cache outside the hook
let globalCache: any[] | null = null;
let isFetching = false;
let subscribers: ((data: any[]) => void)[] = [];

export function useS3Files() {
  const [files, setFiles] = useState<any[]>(globalCache || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (force = false) => {
    if (globalCache && !force) {
      setFiles(globalCache);
      return;
    }

    if (isFetching && !force) return;

    setLoading(true);
    isFetching = true;

    try {
      const res = await fetch("/api/s3/list");
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();
      const items = data.items || [];
      
      globalCache = items;
      setFiles(items);
      
      // Notify other subscribers if any (in a more complex setup)
      subscribers.forEach(cb => cb(items));
    } catch (err) {
      console.error(err);
      setError("Failed to load files");
    } finally {
      setLoading(false);
      isFetching = false;
    }
  };

  useEffect(() => {
    if (!globalCache) {
      fetchData();
    } else {
        setFiles(globalCache);
    }
    
    const sub = (data: any[]) => setFiles(data);
    subscribers.push(sub);
    return () => {
        subscribers = subscribers.filter(s => s !== sub);
    };
  }, []);

  return { files, loading, error, refresh: () => fetchData(true) };
}
