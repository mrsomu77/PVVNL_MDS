"use client";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full bg-white shadow-sm border-b">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between py-2 px-4">
        <div>
        {/* <img src="/logo.png" className="w-10 h-10" /> */}
          <Link href="https://www.abjayon.com" target="_blank">
        <img src="/abjLogo.png" alt="Abjayon Logo" className="h-10 cursor-pointer" />
      </Link>
      </div>
        <div className="flex items-center gap-2" >
          <span className="text-center text-2xl font-bold py-5 text-blue-900">
            Meter Data Search
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-blue-900 font-medium hover:text-blue-600">
            Home
          </Link>
          <a href="/ops-report" className="flex gap-2 items-center text-[#133E7C] font-semibold hover:text-blue-600">
            OPS Report
          </a>
          <a href="/odi-report" className="flex gap-2 items-center text-[#133E7C] font-semibold hover:text-blue-600">
            ODI Report
          </a>
        </div>
      </div>
    </div>
  );
}
