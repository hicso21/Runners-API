import axios from "axios";
import config from "../../config/garminData.json" assert {type:"json"}

const fetchGarmin = axios.create({
  baseURL: config.base_url,
  headers: {
    Accept: 'application/json'
  }
})

export default fetchGarmin