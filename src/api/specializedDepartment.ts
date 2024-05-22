import { config } from "process";
import { base_url } from "../utils/baseUrl"
import axios from "axios";

export const apiGetSpecializedDepartmentById = async (data: number): Promise<any> => {
    const result = await axios.get(`${base_url}SpecializedDepartment/${data}`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetSpecializedDepartment = async (): Promise<any> => {
    const result = await axios.get(`${base_url}SpecializedDepartment`);
    if (result)
        return result;
    else
        return null;
}
