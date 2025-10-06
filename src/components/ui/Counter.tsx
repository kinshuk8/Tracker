"use client";

import React, { useEffect, useState } from "react";

interface CounterProps {
  value: string;
  duration?: number; // Duration of the animation in milliseconds
}

export const Counter: React.FC<CounterProps> = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
  const suffix = value.replace(/[0-9.]/g, "");

  useEffect(() => {
    if (isNaN(numericValue)) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * numericValue));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(numericValue); // Ensure the final value is exactly the target
      }
    };

    window.requestAnimationFrame(step);
  }, [numericValue, duration]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
};
