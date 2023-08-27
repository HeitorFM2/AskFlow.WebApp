import axios from "axios";
import { showNegativeNotify, showPositiveNotify } from "src/util/plugins";


export function Login(data) {
  return axios.post(`${process.env.VUE_APP_API}/v1/login`, data)
    .then((response) => {
      if (response.status == 200) {
        return response.data;
      }
    })
    .catch((error) => {
      console.error('Erro durante o login:', error);
      showNegativeNotify(error.response.data.message);
    });
}

export function Register(data) {
  return axios.post(`${process.env.VUE_APP_API}/v1/user`, data)
    .then((response) => {
      if (response.status == 200) {
        showPositiveNotify("Successfully registered!");
        return response.data
      }
    })
    .catch((error) => {
      console.error('Erro durante o login:', error);
      showNegativeNotify(error.response.data.message);
    });
}
