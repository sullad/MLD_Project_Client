import { config } from "process";
import { base_url } from "../utils/baseUrl"
import axios from "axios";

export const apiGetSubMenu5 = async () => {
    const result = await axios.get(`${base_url}Document5/GetAllDocument5s`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetDoc5ByDoc4Id = async (id: any) => {
    const result = await axios.get(`${base_url}Document5/GetDoc5ByDoc4/${id}`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetDocument5ByUserSpecialiedDepartment = async (query: any) => {
    const result = await axios.get(`${base_url}Document5/GetDocument5ByUserSpecialiedDepartment?${query}`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetSubMenu5ById = async (id: any) => {
    const result = await axios.get(`${base_url}Document5/GetDocument5ById/${id}`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetSubMenu5ByDoc4Id = async (id: string) => {
    const result = await axios.get(`${base_url}Document5/GetDoc5ByDoc4/${id}`);
    if (result)
        return result;
    else
        return null;
}

export const apiPostSubMenu5 = async (data: any) => {
    const result = await axios.post(`${base_url}Document5/AddDocument5`, data);
    if (result)
        return result;
    else
        return null;
}

export const apiUpdateSubMenu5 = async (data: any, docId: any) => {
    const result = await axios.put(`${base_url}Document5/UpdateDocument5`, data);
    if (result)
        return result;
    else
        return null;
}

