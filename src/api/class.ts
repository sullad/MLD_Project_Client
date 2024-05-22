import { config } from "process";
import { base_url } from "../utils/baseUrl"
import axios from "axios";

export const apiGetAllClass = async () => {
    const result = await axios.get(`${base_url}Class/GetAllClasses`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetClassByGradeId = async (gradeId: any) => {
    const result = await axios.get(`${base_url}Class/GetClassByGradeId/${gradeId}`);
    if (result)
        return result;
    else
        return null;
}