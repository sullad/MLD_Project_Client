import { config } from "process";
import { base_url } from "../utils/baseUrl"
import axios from "axios";

export const apiGetSubMenu3 = async (data: any) => {
    const result = await axios.get(`${base_url}Document3/GetAllDoc3sWithCondition`, { params: data });
    if (result)
        return result;
    else
        return null;
}

export const apiGetDocument3ByUserSpecialiedDepartment = async (query: any) => {
    const result = await axios.get(`${base_url}Document3/GetDoc3ByUserDepartment?${query}`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetSubMenu3ById = async (id: string) => {
    const result = await axios.get(`${base_url}Document3/GetDoc3ById/${id}`);
    if (result)
        return result;
    else
        return null;
}

export const apiPostSubMenu3 = async (data: any) => {
    const result = await axios.post(`${base_url}Document3/AddDoc3`, data);
    if (result)
        return result;
    else
        return null;
}

export const apiDeleteSubMenu3 = async (docId: any) => {
    const result = await axios.delete(`${base_url}Document3/DeleteDoc3/${docId}`);
    if (result)
        return result;
    else
        return null;
}

export const apiUpdateSubMenu3 = async (data: any, id: any) => {
    const result = await axios.put(`${base_url}Document3/UpdateDoc3`, data);
    if (result)
        return result;
    else
        return null;
}

export const apiPostSubMenu3CuriculumDistribution = async (data: any) => {
    const result = await axios.post(`${base_url}Document3CuriculumDistribution/AddDoc3CurriculumDistribution`, data);
    if (result)
        return result;
    else
        return null;
}

export const apiPostSubMenu3SelectedTopics = async (data: any) => {
    const result = await axios.post(`${base_url}Document3SelectedTopics/AddDocument3SelectedTopics`, data);
    if (result)
        return result;
    else
        return null;
}


export const apiGetSubMenu3CuriculumDistribution = async (docId: any) => {
    const result = await axios.get(`${base_url}Document3CuriculumDistribution/GetAllByDoc3ID/${docId}`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetSubMenu3SelectedTopics = async (docId: any) => {
    const result = await axios.get(`${base_url}Document3SelectedTopics/GetDoc3SelectedTopicsByDoc3ID/${docId}`);
    if (result)
        return result;
    else
        return null;
}

export const apiDeleteDocument3ForeignTableByDocument3ID = async (docId: any) => {
    const result = await axios.delete(`${base_url}Document3/DeleteDoc3ForeignTableByDoc3Id/${docId}`);
    if (result)
        return result;
    else
        return null;
}


