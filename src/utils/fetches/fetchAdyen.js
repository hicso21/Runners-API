import axios from "axios";
import config from "../../config/adyen.config.js" ;

const fetchAdyen = axios.create({
  baseURL: config.base_url,
  headers: {
    "Content-Type": 'application/json',
    "x-API-key": config.test.apikey
  }
})

export default fetchAdyen