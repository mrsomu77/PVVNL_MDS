// app/odi-report/odiConfig.js

export const ODI_EXECUTIONS = [
  // ================= CONSUMPTION_BATCH (14) =================
  { job: "CONSUMPTION_BATCH", exec: "CM_INTERVAL_TREND" },
  { job: "CONSUMPTION_BATCH", exec: "CM_INTERVAL_SUM" },
  { job: "CONSUMPTION_BATCH", exec: "CM_INTERVAL_COUNT" },
  { job: "CONSUMPTION_BATCH", exec: "CM_DAILY_MISSING_SUM" },
  { job: "CONSUMPTION_BATCH", exec: "CM_PEAK_OFFPEAK" },
  { job: "CONSUMPTION_BATCH", exec: "CM_ZERO_CONSUMPTION" },
  { job: "CONSUMPTION_BATCH", exec: "HOURLY_CONSUMPTION_DETAILS" },
  { job: "CONSUMPTION_BATCH", exec: "MONTHLY_CONSUMPTION_IMPORT" },
  { job: "CONSUMPTION_BATCH", exec: "MONTHLY_CONSUMPTION_VARIATION_2" },
  { job: "CONSUMPTION_BATCH", exec: "CM_REPORT_DN_ANALYSIS" },
  { job: "CONSUMPTION_BATCH", exec: "CM_REPORT_VA_ANALYSIS" },
  { job: "CONSUMPTION_BATCH", exec: "CM_NET_CONSUMPTION_DAILY" },
  { job: "CONSUMPTION_BATCH", exec: "METER_INSTALLATION_DAILY" },
  { job: "CONSUMPTION_BATCH", exec: "MONTHLY_CONS_VARIATION" },

  // ================= CRITICAL_EVENTS_LOAD (4) =================
  { job: "CRITICAL_EVENTS_LOAD", exec: "CM_CRITICAL_EVENTS_DAILY" },
  { job: "CRITICAL_EVENTS_LOAD", exec: "CM_NON_CRITICAL_EVENTS_DAILY" },
  { job: "CRITICAL_EVENTS_LOAD", exec: "CM_OUTAGE_EVENTS_DAILY" },
  { job: "CRITICAL_EVENTS_LOAD", exec: "MV1_RCDC_DC_SUMMARY" },

  // ================= MDM_METER_INSTLD_LOAD =================
  { job: "MDM_METER_INSTLD_LOAD", exec: "S1_MDM_METER_INSTALLED" },

  // ================= MV1_CONSUMER_MASTER =================
  { job: "MV1_CONSUMER_MASTER", exec: "MV1_CONSUMER_MASTER" },

  // ================= FEEDER_DAILY_CONSUMPTION =================
  { job: "FEEDER_DAILY_CONSUMPTION", exec: "B1_FDR_DLY_CONS" },

  // ================= PKG_DT_DLY_CONSUMPTION_NEW =================
  { job: "PKG_DT_DLY_CONSUMPTION_NEW", exec: "B1_DT_DAILY_CONSUMPTION" },

  // ================= PKG_SLA_LOAD (5) =================
  { job: "PKG_SLA_LOAD", exec: "MV1_SLA_RC_DC" },
  { job: "PKG_SLA_LOAD", exec: "CM_DAILY_SLA_MDM" },
  { job: "PKG_SLA_LOAD", exec: "CM_MONTHLY_SLA_MDM" },
  { job: "PKG_SLA_LOAD", exec: "CM_INTERVAL_SLA_MDM" },
  { job: "PKG_SLA_LOAD", exec: "SLA_MONTHLY_SLA_MONITORING_MV" },

  // ================= DAILY_SLA_REFRESH =================
  { job: "DAILY_SLA_REFRESH", exec: "SLA_MV_DAY_PARAM" },

  // ================= RCDC_DETAILS (2) =================
  { job: "RCDC_DETAILS", exec: "RCDCDETAILS" },
  { job: "RCDC_DETAILS", exec: "INTERVAL_SLA_MONITORING" },

  // ================= PREPAIDRECHARGE_TRANSACTIONS =================
  { job: "PREPAIDRECHARGE_TRANSACTIONS", exec: "PREPAIDRECHARGE_TRANSACTIONS" },
];
