export const ODI_JOBS = [
  {
    jobName: "CONSUMPTION_BATCH",
    executions: [
      "CM_INTERVAL_TREND",
      "CM_INTERVAL_SUM",
      "CM_INTERVAL_COUNT",
      "CM_DAILY_MISSING_SUM",
      "CM_PEAK_OFFPEAK",
      "CM_ZERO_CONSUMPTION",
      "HOURLY_CONSUMPTION_DETAILS",
      "MONTHLY_CONSUMPTION_IMPORT",
      "MONTHLY_CONSUMPTION_VARIATION_2",
      "CM_REPORT_DN_ANALYSIS",
      "CM_REPORT_VA_ANALYSIS",
      "CM_NET_CONSUMPTION_DAILY",
      "METER_INSTALLATION_DAILY",
      "S1_MDM_METER_INSTALLED",
    ],
  },
  {
    jobName: "CRITICAL_EVENTS_LOAD",
    executions: [
      "CM_CRITICAL_EVENTS_DAILY",
      "CM_NON_CRITICAL_EVENTS_DAILY",
      "CM_OUTAGE_EVENTS_DAILY",
    ],
  },
  {
    jobName: "MDM_METER_INSTLD_LOAD",
    executions: ["S1_MDM_METER_INSTALLED"],
  },
  {
    jobName: "RCDC_DC_SUMMARY",
    executions: ["T1_RCDC_DC_SUMMARY"],
  },
  {
    jobName: "MV1_CONSUMER_MASTER",
    executions: ["C1_CONSUMER_MASTER"],
  },
  {
    jobName: "FEEDER_DAILY_CONSUMPTION",
    executions: ["B1_FDR_DLY_CONS"],
  },
  {
    jobName: "PKG_DT_DLY_CONSUMPTION_NEW",
    executions: ["B1_DT_DAILY_CONSUMPTION"],
  },
  {
    jobName: "PKG_SLA_LOAD",
    executions: [
      "CM_DAILY_SLA_MDM",
      "CM_MONTHLY_SLA_MDM",
      "CM_INTERVAL_SLA_MDM",
      "SLA_MONTHLY_SLA_MONITORING_MV",
    ],
  },
  {
    jobName: "DAILY_SLA_REFRESH",
    executions: ["SLA_MV_DAY_PARAM"],
  },
  {
    jobName: "RCDC_DETAILS",
    executions: ["RCDCDETAILS"],
  },
  {
    jobName: "PRC_LOAD_INTERVAL_SLA_MONITORING",
    executions: ["INTERVAL_SLA_MONITORING"],
  },
  {
    jobName: "PREPAIDRECHARGE_TRANSACTIONS",
    executions: ["PREPAIDRECHARGE_TRANSACTIONS"],
  },
];
