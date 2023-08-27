import axios from "axios";
import { LocalStorage } from "quasar";
import { showNegativeNotify, showPositiveNotify } from "src/util/plugins";
import { logout } from "src/util/auth"

const headers = {
  Authorization: LocalStorage.getItem("token")
}

export function getUser() {
  return axios.get(`${process.env.VUE_APP_API}/v1/user/${LocalStorage.getItem("iduser")}`, { headers: headers })
    .then((response) => {
      if (response.data.success) return response.data;
      return null
    })
    .catch((error) => {
      if (error.response.status == 401) {
        logout()
      }
      console.error('Error during API query:', error);
      showNegativeNotify("Sorry, there was an error - try again later!");
    });
}

export function getUserPost() {
  return axios.get(`${process.env.VUE_APP_API}/v1/posts/${LocalStorage.getItem("iduser")}`, { headers: headers })
    .then((response) => {
      if (response.data.success) return response.data;
      return null
    })
    .catch((error) => {
      if (error.response.status == 401) {
        logout()
      }
      console.error('Error during API query:', error);
      showNegativeNotify("Sorry, there was an error - try again later!");
    });
}

export function getPosts() {
  return axios.get(`${process.env.VUE_APP_API}/v1/posts`, { headers: headers })
    .then((response) => {
      if (response.status == 200) return response.data;
      return null
    })
    .catch((error) => {
      if (error.response.status == 401) {
        logout()
      }
      console.error('Error during API query:', error);
      showNegativeNotify("Sorry, there was an error - try again later!");
    });
}

export function getDetailPost(idpost) {
  return axios.get(`${process.env.VUE_APP_API}/v1/post/${idpost}`, { headers: headers })
    .then((response) => {
      if (response.data.success) return response.data.data[0];
      return null
    })
    .catch((error) => {
      if (error.response.status == 401) {
        logout()
      }
      console.error('Error during API query:', error);
      showNegativeNotify("Sorry, there was an error - try again later!");
    });
}

export function getResponsesPost(idpost) {
  return axios.get(`${process.env.VUE_APP_API}/v1/responses/${idpost}`, { headers: headers })
    .then((response) => {
      if (response.data.success) return response.data.data;
      return null
    })
    .catch((error) => {
      if (error.response.status == 401) {
        logout()
      }
      console.error('Error during API query:', error);
      showNegativeNotify("Sorry, there was an error - try again later!");
    });
}

export function createPost(data) {

  return axios.post(`${process.env.VUE_APP_API}/v1/post`, data, { headers: headers })
    .then((response) => {
      if (response.data.success) {
        showPositiveNotify("Post created successfully!");
        return response.data
      } else {
        showNegativeNotify(response.data.message);
        throw new Error(response.data.message);
      }
    })
    .catch((error) => {
      if (error.response.status == 401) {
        logout()
      }
      console.error('Error during API query:', error);
      showNegativeNotify("Sorry, there was an error - try again later!");
    });
}

export function createResponse(data) {
  return axios.post(`${process.env.VUE_APP_API}/v1/response`, data, { headers: headers })
    .then((response) => {
      if (response.data.success) {
        showPositiveNotify("Response created successfully!");
        return response.data
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

export function usernameEdit(data) {
  return axios.put(`${process.env.VUE_APP_API}/v1/username/${LocalStorage.getItem("iduser")}`, data, { headers: headers })
    .then((response) => {
      if (response.data.success) {
        showPositiveNotify("Username edited successfully!");
      }
    })
    .catch((error) => {
      if (error.response.status == 401) {
        logout()
      }
      console.error('Error during API query:', error);
      showNegativeNotify("Sorry, there was an error - try again later!");
    });
}

export function imgEdit(data) {
  return axios.put(`${process.env.VUE_APP_API}/v1/img/${LocalStorage.getItem("iduser")}`, data, { headers: headers })
    .then((response) => {
      if (response.data.success) {
        showPositiveNotify("Image edited successfully!");
      }
    })
    .catch((error) => {
      if (error.response.status == 401) {
        logout()
      }
      console.error('Error during API query:', error);
      showNegativeNotify("Sorry, there was an error - try again later!");
    });
}

export function deletePost(idpost) {
  return axios.delete(`${process.env.VUE_APP_API}/v1/post/${idpost}`, { headers: headers })
    .then((response) => {
      if (response.data.success) {
        showPositiveNotify("Post successfully deleted");
      } else {
        showNegativeNotify(response.data.message);
        throw new Error(response.data.message);
      }
    })
    .catch((error) => {
      if (error.response.status == 401) {
        logout()
      }
      console.error('Error during API query:', error);
      showNegativeNotify("Sorry, there was an error - try again later!");
    });
}

export function deleteResponse(idresponse) {
  return axios.delete(`${process.env.VUE_APP_API}/v1/response/${idresponse}`, { headers: headers })
    .then((response) => {
      if (response.data.success) {
        showPositiveNotify("Response successfully deleted");
      } else {
        showNegativeNotify(response.data.message);
        throw new Error(response.data.message);
      }
    })
    .catch((error) => {
      if (error.response.status == 401) {
        logout()
      }
      console.error('Error during API query:', error);
      showNegativeNotify("Sorry, there was an error - try again later!");
    });
}
