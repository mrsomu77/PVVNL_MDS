"use client";
import BatchDataSection from "./BatchDataSection";
import MdsSyncSection from "./MdsSyncSection";

export default function OpsReport() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center text-[#133E7C]">
        OPS Report
      </h1>

      <BatchDataSection />
      <MdsSyncSection />
    </div>
  );
}
