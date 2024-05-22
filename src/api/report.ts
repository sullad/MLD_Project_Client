import { config } from "process";
import { base_url } from "../utils/baseUrl"
import axios from "axios";

export const apiPostReport = async (data: any) => {
    const result = await axios.post(`${base_url}Report/AddReport`, data);
    if (result)
        return result;
    else
        return null;
}

