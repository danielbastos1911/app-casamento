"use client";

import { useEffect, useState } from "react";

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((diff / (1000 * 60)) % 60),
    segundos: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    const target = new Date(targetDate);
    const tick = () => setTimeLeft(getTimeLeft(target));
    const timeout = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [targetDate]);

  if (!timeLeft) {
    return <div className="h-20" aria-hidden />;
  }

  const items = [
    { label: "dias", value: timeLeft.dias },
    { label: "horas", value: timeLeft.horas },
    { label: "min", value: timeLeft.minutos },
    { label: "seg", value: timeLeft.segundos },
  ];

  return (
    <div className="flex justify-center gap-4 sm:gap-8">
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <div className="text-3xl font-semibold text-rose-500 sm:text-4xl">
            {String(item.value).padStart(2, "0")}
          </div>
          <div className="text-xs uppercase tracking-wide text-neutral-500">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
