import { config } from "process";
import { base_url } from "../utils/baseUrl"
import axios from "axios";

export const apiGetCurriculumDistribution = async () => {
    const result = await axios.get(`${base_url}CurriculumDistribution/GetAllCurriculums`);
    if (result)
        return result;
    else
        return null;
}