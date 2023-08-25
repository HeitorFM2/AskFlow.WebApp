import axios from "axios";
import { showNegativeNotify, showPositiveNotify } from "src/util/plugins";


export function Login(data) {
  return axios.post(`${process.env.VUE_APP_API}/v1/login`, data)
    .then((response) => {
      if (response.status == 200) {
        return response.data;
      } else {
        showNegativeNotify(response.data.message);
      }
    })
    .catch((error) => {
      console.error('Erro durante o login:', error);
      throw error;
    });
}

export function Register(data) {
  return axios.post(`${process.env.VUE_APP_API}/v1/user`, data)
    .then((response) => {
      if (response.data.success) {
        showPositiveNotify("Successfully registered!");
      } else {
        showNegativeNotify(response.data.message);
        throw new Error(response.data.message);
      }
    })
    .catch((error) => {
      console.error('Erro durante o login:', error);
      throw error;
    });
}
