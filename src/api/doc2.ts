import { base_url } from "../utils/baseUrl"
import axios from "axios";

export const apiGetDoc2 = async (): Promise<any> => {
    const result = await axios.get(`${base_url}Document2`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetUserHostBy =async (data: number): Promise<any> => {
    const result = await axios.get(`${base_url}Document2/GetUserByDepId?depId==${data}`);
    if (result)
        return result;
    else
        return null;
}

