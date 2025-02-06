import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    // Initialize state with initialValue
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        const item = window.localStorage.getItem(key);
        setStoredValue(item != undefined ? JSON.parse(item) as T : initialValue);
        setLoaded(true);

        // only do this hook on load
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (loaded) {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } 
    }, [key, loaded, storedValue]);

    return [storedValue, setStoredValue];
}

export default useLocalStorage;

