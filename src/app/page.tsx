"use client";

import InteractiveAvatar from "@/components/InteractiveAvatar";

/**
 * THE AUTHORMELD ENTRY POINT
 * We've delegated all state management and transitions (1, 2, 3) 
 * to the InteractiveAvatar component to ensure a unified cinematic flow.
 */
export default function Home() {
  return (
    <main className="w-screen h-screen bg-black overflow-hidden select-none">
      <InteractiveAvatar />
    </main>
  );
}
