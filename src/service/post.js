import axios from "axios";
import { LocalStorage } from "quasar";
import { showNegativeNotify, showPositiveNotify } from "src/util/plugins";


export function getUser() {
  return axios.get(`${process.env.APP_ROUTER}/v1/user/${LocalStorage.getItem("iduser")}`)
    .then((response) => {
      if (response.data.success) {
        return response.data;
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

export function getUserPost() {
  return axios.get(`${process.env.APP_ROUTER}/v1/posts/${LocalStorage.getItem("iduser")}`)
    .then((response) => {
      if (response.data.success) {
        return response.data;
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

export function getPosts() {
  return axios.get(`${process.env.APP_ROUTER}/v1/posts`)
    .then((response) => {
      if (response.data.success) {
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

export function createPost(data) {
  return axios.post(`${process.env.APP_ROUTER}/v1/post`, data)
    .then((response) => {
      if (response.data.success) {
        showPositiveNotify(response.data.message);
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

export function createResponse(data) {
  return axios.post(`${process.env.APP_ROUTER}/v1/response`, data)
    .then((response) => {
      if (response.data.success) {
        showPositiveNotify(response.data.message);
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

export function getDetailPost(idpost) {
  return axios.get(`${process.env.APP_ROUTER}/v1/post/${idpost}`)
    .then((response) => {
      if (response.data.success) {
        return response.data.data[0]
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

export function getResponsesPost(idpost) {
  return axios.get(`${process.env.APP_ROUTER}/v1/responses/${idpost}`)
    .then((response) => {
      if (response.data.success) {
        return response.data.data
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

export function deletePost(idpost) {
  return axios.delete(`${process.env.APP_ROUTER}/v1/post/${idpost}`)
    .then((response) => {
      if (response.data.success) {
        showPositiveNotify("Post successfully deleted");
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


