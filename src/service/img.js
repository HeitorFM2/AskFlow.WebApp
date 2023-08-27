import axios from "axios";
import { LocalStorage } from "quasar";
import { showNegativeNotify, showPositiveNotify } from "src/util/plugins";

const headers = {
  Authorization: LocalStorage.getItem("token")
}

export function imgImgur(data) {
  return axios.post(`${process.env.VUE_APP_API}/v1/upload`, data, { headers: headers })
    .then((response) => {
      if (response.status == 200) {
        return response.data
      }
    })
    .catch((error) => {
      if (error.response.status == 401) {
        logout()
      }
      console.error('Error during API query:', error);
      showNegativeNotify("Error uploading image!");
    });
}
