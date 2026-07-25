import { useState, useEffect } from 'react';

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function useTouchDevice() {
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    setTouch(isTouchDevice());
  }, []);

  return touch;
}

export function isTouchDeviceValue() {
  return isTouchDevice();
}
