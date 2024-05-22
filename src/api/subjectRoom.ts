import { config } from "process";
import { base_url } from "../utils/baseUrl"
import axios from "axios";

export const apiGetSubjectRoom = async () => {
    const result = await axios.get(`${base_url}SubjectRoom`);
    if (result)
        return result;
    else
        return null;
}