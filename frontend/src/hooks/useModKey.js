import { useState, useEffect } from 'react';

function getModKey() {
  const ua = navigator.userAgent || '';
  return ua.includes('Mac') && !ua.includes('Mobile') ? '⌘' : 'Ctrl +';
}

export function useModKey() {
  const [modKey, setModKey] = useState('');

  useEffect(() => {
    setModKey(getModKey());
  }, []);

  return modKey;
}

export function getModKeyValue() {
  return getModKey();
}
