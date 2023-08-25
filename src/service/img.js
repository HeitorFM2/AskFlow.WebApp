import axios from "axios";
import { LocalStorage } from "quasar";
import { showNegativeNotify, showPositiveNotify } from "src/util/plugins";

const headers = {
  Authorization: LocalStorage.getItem("token")
}

export function imgImgur(data) {
  return axios.post("http://localhost:3000/v1/upload", data, { headers: headers })
    .then((response) => {
      if (response.data.success) {
        return response.data.data;
      } else {
        showNegativeNotify(response.data.message);
        throw new Error(response.data.message);
      }
    })
    .catch((error) => {
      console.error('Error during API query:', error);
      throw error;
    });
}
