import { config } from "process";
import { base_url } from "../utils/baseUrl"
import axios from "axios";

export const apiGetUser = async (data: any): Promise<any> => {
    const result = await axios.get(`${base_url}User/GetUserById/${data}`);
    if (result)
        return result;
    else
        return null;
}

export const apiupdateUser = async (data: any, id: number): Promise<any> => {
    const result = await axios.put(`${base_url}User/UpdateUser`, data);
    if (result)
        return result;
    else
        return null;
}

export const apiGetAllGetUser = async (): Promise<any> => {
    const result = await axios.get(`${base_url}User/GetAllUsers`);
    if (result)
        return result;
    else
        return null;
}
