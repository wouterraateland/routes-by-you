import { useCallback, useEffect, useState } from "react";

const getLocalStorage = (key, fallback) => {
  if (typeof localStorage === "undefined") {
    return fallback;
  }
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : fallback;
};

const setLocalStorage = (key, value) =>
  typeof localStorage !== "undefined"
    ? localStorage.setItem(key, JSON.stringify(value))
    : undefined;

export default function useLocallyStoredState({ key, initialValue }) {
  const [state, _setState] = useState(getLocalStorage(key, initialValue));
  const setState = useCallback(
    (v) =>
      _setState((state) => {
        const newState = typeof v === "function" ? v(state) : v;
        setLocalStorage(key, newState);
        return newState;
      }),
    [key]
  );

  useEffect(() => {
    _setState(getLocalStorage(key, initialValue));
  }, [key, initialValue]);

  return [state, setState];
}
