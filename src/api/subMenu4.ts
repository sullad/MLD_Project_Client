import { config } from "process";
import { base_url } from "../utils/baseUrl"
import axios from "axios";

export const apiGetSubMenu4 = async (data: any) => {
    const result = await axios.get(`${base_url}Document4/GetAllDoc4sWithCondition`, { params: data });
    if (result)
        return result;
    else
        return null;
}

export const apiGetDocument4ByUserSpecialiedDepartment = async (query: any) => {
    const result = await axios.get(`${base_url}Document4/GetDocument4ByUserSpecialiedDepartment?${query}`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetSubMenu4ById = async (id: string) => {
    const result = await axios.get(`${base_url}Document4/GetDoc4ById/${id}`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetSubMenu4infoById = async (id: string) => {
    const result = await axios.get(`${base_url}Document4/GetDoc4InformationByDoc4Id?id=${id}`);
    if (result)
        return result;
    else
        return null;
}


export const apiPostSubMenu4 = async (data: any): Promise<any> => {
    const result = await axios.post(`${base_url}Document4/AddDocument4`, data);
    if (result)
        return result;
    else
        return null;
}

export const apiDeleteSubMenu4 = async (docId: any) => {
    const result = await axios.delete(`${base_url}Document4/DeleteDoc4/${docId}`);
    if (result)
        return result;
    else
        return null;
}

export const apiUpdateSubMenu4 = async (data: any, docId: any) => {
    const result = await axios.put(`${base_url}Document4`, data);
    if (result)
        return result;
    else
        return null;
}

export const apiGetDoc4ByDoc3Id = async (docId: any) => {
    const result = await axios.get(`${base_url}Document4/GetDocument4sByDoc3Id?doc3Id=${docId}`);
    if (result)
        return result;
    else
        return null;
}
