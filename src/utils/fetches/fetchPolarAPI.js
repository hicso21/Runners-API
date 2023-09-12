import axios from "axios";
import config from "../../config/polarData.json" assert {type:"json"}

const fetchPolar = axios.create({
  baseURL: config.base_url,
  headers: {
    Accept: 'application/json'
  }
})

export default fetchPolar