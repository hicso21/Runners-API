import axios from "axios";
import config from "../config/suuntoData.json" assert {type:"json"}

const fetchSuunto = axios.create({
  baseURL: config.base_url,
  headers: {
    Accept: 'application/json'
  }
})

export default fetchSuunto