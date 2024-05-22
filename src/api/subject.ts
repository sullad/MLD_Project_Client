import { config } from "process";
import { base_url } from "../utils/baseUrl"
import axios from "axios";

export const apiGetSubject = async () => {
    const result = await axios.get(`${base_url}Subject`);
    if (result)
        return result;
    else
        return null;
}