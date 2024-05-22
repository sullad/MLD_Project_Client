import { config } from "process";
import { base_url } from "../utils/baseUrl"
import axios from "axios";

export const apiEvaluateById = async (docId: any) => {
    const result = await axios.get(`${base_url}Evaluate/GetEvaluateById/${docId}`);
    if (result)
        return result;
    else
        return null;
}

export const apiPostEvaluate = async (data: any) => {
    const result = await axios.post(`${base_url}Evaluate/AddEvaluate`, data);
    if (result)
        return result;
    else
        return null;
}
export const apiUpdateEvaluate = async (data: any) => {
    const result = await axios.put(`${base_url}Evaluate/UpdateEvaluate`, data);
    if (result)
        return result;
    else
        return null;
}