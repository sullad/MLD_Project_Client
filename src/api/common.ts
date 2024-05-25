import { config } from "process";
import { base_url } from "../utils/baseUrl"
import axios from "axios";

export const apiGetDocByUserAndApproveId = async (userId :number,doctype:number,approveBy : number) => {
    const result = await axios.get(`${base_url}Common/GetDocumentsByUserAndApproveDoc/${userId}/${doctype}/${approveBy}`);
    if (result)
        return result;
    else
        return null;
}
