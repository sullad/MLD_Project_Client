import { config } from "process";
import { base_url } from "../utils/baseUrl"
import axios from "axios";

export const apiGetGrade = async () => {
    const result = await axios.get(`${base_url}Grade/GetAllGrades`);
    if (result)
        return result;
    else
        return null;
}