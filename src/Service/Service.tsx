import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { message } from "antd";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASEURL,
});

export const axiosInstanceAuth = axios.create({
  baseURL: process.env.REACT_APP_BASEURL,
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    console.log("here request", config);
    return config;
  },
  function (error) {
    // Do something with request error
    console.log("error", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (config: any) => {
    console.log("here response", config);
    return config;
  },
  function (error) {
    // Do something with request error
    toast.error(error.response.data.message);

    console.log("error", error.AxiosError);
    return Promise.reject(error);
  }
);

axiosInstanceAuth.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  function (error) {
    // Do something with request error
    console.log("error", error);
    return Promise.reject(error);
  }
);
axiosInstanceAuth.interceptors.response.use(
  (config: any) => {
    if (config.response?.data.message) {
      toast.success(config.response.data.message);
    }

    return config;
  },
  function (error) {
    toast.error(error.response.data.message);

    console.log("forbidden", error);
    return Promise.reject(error);
  }
);
