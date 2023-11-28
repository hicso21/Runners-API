import axios from "axios";
import config from "../../config/stravaData.js" ;

const fetchStrava = axios.create({
  baseURL: config.base_url,
  headers: {
    Accept: 'application/json'
  }
})

export default fetchStrava