"use client";

import dynamic from "next/dynamic";

const TravelMap = dynamic(() => import("./travel-map"), {
  ssr: false,
  loading: () => (
    <main className="loading-screen">
      <div className="brand-mark">ŚLADY</div>
      <p>Rozkładamy mapę…</p>
    </main>
  ),
});

export default function Home() {
  return <TravelMap />;
}
