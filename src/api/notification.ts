import { config } from "process";
import { base_url } from "../utils/baseUrl"
import axios from "axios";

export const apiPostNotification = async (data: any) => {
    const result = await axios.post(`${base_url}Notification/AddNotification`, [data]);
    if (result)
        return result;
    else
        return null;
}

export const apiGetListIdOfTeacherAndPricipleByDepartmentId = async (data: any) => {
    const result = await axios.get(`${base_url}Notification/GetListIdOfTeacherAndPricipleByDepartmentId?listDepartmentId=${data}`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetListHostbyByIdOfUserByDoc2Id = async (data: any) => {
    const result = await axios.get(`${base_url}Notification/GetListHostbyByIdOfUserByDoc2Id`, data);
    if (result)
        return result;
    else
        return null;
}

export const apiGetDocByDocTypeAndId = async (query: any) => {
    const result = await axios.get(`${base_url}Notification/GetDocByDocTypeAndId`, { params: query });
    if (result)
        return result;
    else
        return null;
}

export const apiGetNotificationByReceiverId = async (data: any) => {
    const result = await axios.get(`${base_url}Notification/GetNotificationByReceiverId/${data}`);
    if (result)
        return result;
    else
        return null;
}
