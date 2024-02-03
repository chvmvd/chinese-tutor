import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useAsyncStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => Promise<void>, () => Promise<void>] {
  const [storedValue, setStoredValue] = useState(initialValue);

  async function getStoredValue() {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) {
        await AsyncStorage.setItem(key, JSON.stringify(initialValue));
        setStoredValue(initialValue);
      } else {
        setStoredValue(JSON.parse(value));
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getStoredValue();
  }, [key, initialValue]);

  async function setValue(value: T) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      setStoredValue(value);
    } catch (error) {
      console.error(error);
    }
  }

  return [storedValue, setValue, getStoredValue];
}
