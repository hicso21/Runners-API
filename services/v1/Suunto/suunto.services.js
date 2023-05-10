import fetchSuunto from "../../../utils/fetchSuuntoAPI";

class SuuntoServices {
  
  static async authorize () {
    try {
      const res = await fetchSuunto({url: `/oauth/authorize`, method: "GET"})
      return res
    } catch (error) {
      console.log(error.message)
      return {error: error.message}
    }
  }

  static async token () {
    try {
      const res = await fetchSuunto({url: "/oauth/token", method: "POST"})
    } catch (error) {
      
    }
  }

}

export default SuuntoServices