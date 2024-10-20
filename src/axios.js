import axios from "axios";

export default axios.create({
  baseURL:
    "https://admin-service2-gshrdfcfftdccscx.canadacentral-01.azurewebsites.net/api/v1",
  headers: {
    "Content-type": "application/json",
  },
});
