/* eslint-disable no-param-reassign */
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import type { Iuser } from '../types';

interface IAuth {
  isLogin: boolean;
  token: string;
  user: Iuser;

}

export const requestInterceptor: () => void = () => {
  axios.interceptors.request.use((config: AxiosRequestConfig) => {
    config.baseURL = process.env.REACT_APP_BASE_URL;
    const authJson: string | null = window.localStorage.getItem('auth');
    if (authJson !== null) {
      const auth: IAuth = JSON.parse(authJson);
      if (config.headers) {
        config.headers.Authorization = `Token ${auth.token}`;
      }
    }

    return config;
  }, async (error) => Promise.reject(error));
};

const reponseInterceptor: () => void = () => {
  axios.interceptors.response.use((response: AxiosResponse) => response, async (error) => {
    // if (error?.response?.status === 401) {
    //   // window.location.href = '/signin';
    //   window.localStorage.removeItem('auth');
    // }
    if (error?.response !== undefined) {
      return Promise.reject(error?.response);
    }
    return Promise.reject(error);
  });
};

const initAxios: () => void = () => {
  requestInterceptor();
  reponseInterceptor();
};

export default initAxios;
