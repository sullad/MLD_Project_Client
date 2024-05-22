import { config } from "process";
import { base_url } from "../utils/baseUrl"
import axios from "axios";

export const apiGetSubMenu2 = async (data: any) => {
    const result = await axios.get(`${base_url}Document2/GetAllDoc2sWithCondition`, { params: data });
    if (result)
        return result;
    else
        return null;
}

export const apiGetDocument2ByUserSpecialiedDepartment = async (query: any) => {
    const result = await axios.get(`${base_url}Document2/GetDoc2ByUserDepartment?${query}`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetSubMenu2ById = async (id: string) => {
    const result = await axios.get(`${base_url}Document2/GetDoc2ById/${id}`);
    if (result)
        return result;
    else
        return null;
}

export const apiPostSubMenu2 = async (data: any) => {
    const result = await axios.post(`${base_url}Document2/AddDocument2`, data);
    if (result)
        return result;
    else
        return null;
}

export const apiPostSubMenu2Grade = async (data: any) => {
    const result = await axios.post(`${base_url}Document2Grade/AddDoc2Grade`, data);
    if (result)
        return result;
    else
        return null;
}

export const apiGetDocument2GradeById = async (data: any) => {
    const result = await axios.get(`${base_url}Document2Grade/GetDoc2GradeById/${data}`);
    if (result)
        return result;
    else
        return null;
}

export const apiDeleteSubMenu2 = async (docId: any) => {
    const result = await axios.delete(`${base_url}Document2/DeleteDoc2/${docId}`);
    if (result)
        return result;
    else
        return null;
}

export const apiUpdateSubMenu2 = async (data: any, docId: any) => {
    const result = await axios.put(`${base_url}Document2/UpdateDoc2`, data);
    if (result)
        return result;
    else
        return null;
}

export const apiDeleteDocument2GradeByDocument2Id = async (docId: any) => {
    const result = await axios.delete(`${base_url}Document2Grade/DeleteDoc2GradeByDoc2Id?id=${docId}`);
    if (result)
        return result;
    else
        return null;
}
export const apiGetUserHostBy = async (data: number): Promise<any> => {
    const result = await axios.get(`${base_url}Document2/GetUserByDepId?depIds=${data}`);
    if (result)
        return result;
    else
        return null;
}

