"use client";

import OngoingBatches from "./components/OngoingBatches";
import ImdCounts from "./components/ImdCounts";
import AlarmBatches from "./components/AlarmBatches";
import CreJobs from "./components/CreJobs";

export default function HomePage() {
  return (
    <div className="p-6 space-y-8">
      <OngoingBatches />
      <AlarmBatches />
      <CreJobs />
      <ImdCounts />
    </div>
  );
}
