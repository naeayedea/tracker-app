import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    // Initialize state with initialValue
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    useEffect(() => {
        const item = window.localStorage.getItem(key);
        setStoredValue(item != undefined ? JSON.parse(item) as T : initialValue);
    }, [])

    useEffect(() => {

        console.log("New state ", storedValue)

        if (JSON.stringify(storedValue) !== JSON.stringify(initialValue)) {
            console.log("updating value to ", JSON.stringify(storedValue))
            console.log(storedValue)

            window.localStorage.setItem(key, JSON.stringify(storedValue));
        }

    }, [storedValue]);


    return [storedValue, (value: T | ((val: T) => T)) => {
        console.log("setStoredValue received ", value)

        setStoredValue(value)
    }];
}

export default useLocalStorage;

