import axios, { AxiosResponse } from "axios";
import { base_url } from "../../utils/baseUrl.ts";
import { config } from "../../utils/axiosConfig.ts";

const login = async (userData: any): Promise<any> => {
  const res: AxiosResponse = await axios.post(
    `${base_url}Account/Login`,
    userData,
    config,
  );
  if (res.data) {
    return res.data;
  }
};

const checkAuthentication = async (): Promise<any> => {
  const res: AxiosResponse = await axios.get(
    `${base_url}Account/CheckAuthenciation`, config);
  if (res.data) {
    return res.data;
  }
};

const logout = async (): Promise<any> => {
  const res: AxiosResponse = await axios.get(`${base_url}user/logout`, config);
  if (res.data) {
    window.location.reload();
    return res.data;
  }
};

export const authService = {
  login,
  logout,
  checkAuthentication
};
