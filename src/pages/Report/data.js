// dummyReportData.js

export const getDummyReportData = (reportType, timePeriod) => {
  let dummyResponse;

  switch (reportType) {
    case "sales":
      dummyResponse = {
        title: `Sales (Booking) Report (${timePeriod})`,
        data: `
          Total sales: 74
            Deadpool: 13 tickets
            Dune: 12 tickets
            Twisters: 10 tickets
            Despicable: 9 tickets
        `,
      };
      break;

    case "revenue":
      dummyResponse = {
        title: `Revenue Report (${timePeriod})`,
        data: `
          Total revenue: Rs. 119400
            Deadpool: Rs 15000
            Dune: Rs 1000
        `,
      };
      break;

    case "popular-shows":
      dummyResponse = {
        title: `Popular Shows Report (${timePeriod})`,
        data: `
          Deadpool: 43 tickets
          Dune: 12 tickets
          Twisters: 10 tickets
          Despicable: 9 tickets
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
