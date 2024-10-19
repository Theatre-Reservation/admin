import axios from "axios";

export default axios.create({
  baseURL:
    "https://admin-service1-hmepajeze3g4gyaq.canadacentral-01.azurewebsites.net/api/v1",
  headers: {
    "Content-type": "application/json",
  },
});
