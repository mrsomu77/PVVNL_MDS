// // lib/date.js

// export function getTodayRange() {
//   const now = new Date();

//   const start = new Date();
//   start.setHours(0, 0, 0, 0);

//   const toInput = (d) => d.toISOString().slice(0, 16);

//   return {
//     from: toInput(start),
//     to: toInput(now),
//   };
// }

// export function formatToIST(dateVal) {
//   if (!dateVal) return "-";

//   const d = new Date(dateVal);

//   return d.toLocaleString("en-IN", {
//     timeZone: "Asia/Kolkata",
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: false,
//   });
// }


// lib/date.js

function pad(n) {
  return String(n).padStart(2, "0");
}

/* ===========================
   DEFAULT RANGE (IST SAFE)
=========================== */
export function getTodayRange() {
  const now = new Date();

  // Build LOCAL datetime (not UTC)
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  );

  const toInput = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;

  return {
    from: toInput(start), // Today 00:00 IST
    to: toInput(now),     // Current IST time
  };
}

/* ===========================
   DISPLAY FORMAT (IST)
=========================== */
export function formatToIST(dateVal) {
  if (!dateVal) return "-";

  const d = new Date(dateVal);

  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}
