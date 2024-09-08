// dummyReportData.js

export const getDummyReportData = (reportType, timePeriod) => {
  let dummyResponse;

  switch (reportType) {
    case "sales":
      dummyResponse = {
        title: `Sales Report (${timePeriod})`,
        data: `
          Total sales: $1500
          Product A: $500
          Product B: $300
          Product C: $700
        `,
      };
      break;

    case "revenue":
      dummyResponse = {
        title: `Revenue Report (${timePeriod})`,
        data: `
          Total revenue: $2500
          Service X: $1500
          Service Y: $1000
        `,
      };
      break;

    case "popular-shows":
      dummyResponse = {
        title: `Popular Shows Report (${timePeriod})`,
        data: `
          Show 1: 500 tickets
          Show 2: 300 tickets
          Show 3: 200 tickets
        `,
      };
      break;

    default:
      dummyResponse = {
        title: `Unknown Report (${timePeriod})`,
        data: "No data available.",
      };
  }

  return dummyResponse;
};
