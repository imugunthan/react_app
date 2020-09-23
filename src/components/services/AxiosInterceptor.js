import axios from 'axios';
import {getData} from './AsyncStorage';

var axiosInstance = axios.create();

//Axios Interceptor to Handle the HTTP request and add token to it
axiosInstance.interceptors.request.use(async (config) => {
  try {
    const tokenResponse = await getData('access_token');
    const organization_id = await getData('organization_id');
    const current_user = await getData('user_id');
    const tenant = await getData('tenant');
    config.headers.Authorization = `EDVAY ${tokenResponse}`;
    config.headers.current_user = current_user;
    config.headers.org_id = organization_id;
    config.headers.tenant = tenant;
    config.headers.type = 2;
    return config;
  } catch (error) {
    console.log(error);
  }
});

//Axios Interceptor to Handle the HTTP response
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle response errors (401)
    return error;
  },
);

export default axiosInstance;
