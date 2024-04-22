import axios from "axios";
import config from "../../config/payment.js" ;

const fetchPayment = axios.create({
  baseURL: config.base_url,
  headers: {
    "Content-Type": 'application/json',
    "x-API-key": config.test.apikey
  }
})

export default fetchPayment