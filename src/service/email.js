import axios from "axios";
import { LocalStorage } from "quasar";

import { showNegativeNotify, showPositiveNotify } from "src/util/plugins";

const headers = {
  Authorization: LocalStorage.getItem("token")
}

export function emailSend(data) {
  return axios.post(`${process.env.VUE_APP_API}/v1/send/email`, data)
    .then((response) => {
      if (response.status == 200) {
        showPositiveNotify("Email sent successfully!")
        return response.data
      }
    })
    .catch((error) => {
      if (error.response.status == 401) {
        logout()
      }
      console.error('Error during API query:', error);
      showNegativeNotify("Error sending image!");
    });
}

export function emailEdit(data) {
  return axios.put(`${process.env.VUE_APP_API}/v1/email/${LocalStorage.getItem("iduser")}`, data, { headers: headers })
    .then((response) => {
      if (response.data.success) {
        showPositiveNotify("Email edited successfully!");
      }
    })
    .catch((error) => {
      if (error.response.status == 401) {
        logout()
      }
      console.error('Error during API query:', error);
      showNegativeNotify("Sorry, there was an error - try again later!");
      throw error;
    });
}
