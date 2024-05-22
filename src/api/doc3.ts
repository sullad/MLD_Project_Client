import { base_url } from "../utils/baseUrl"
import axios from "axios";

export const apiGetDoc3 = async (): Promise<any> => {
    const result = await axios.get(`${base_url}Document3`);
    if (result)
        return result;
    else
        return null;
}
