import { config } from "process";
import { base_url } from "../utils/baseUrl"
import axios from "axios";

export const apiGetSubMenu1 = async (data: any) => {
    const result = await axios.get(`${base_url}Document1/GetAllDoc1sWithCondition`, { params: data });
    if (result)
        return result;
    else
        return null;
}

export const apiGetDocument1ByUserSpecialiedDepartment = async (query: any) => {
    const result = await axios.get(`${base_url}Document1/GetDoc1ByUserDepartment?${query}`);
    if (result)
        return result;
    else
        return null;
}

export const apiUpdateSubMenu1 = async (data: any) => {
    const result = await axios.put(`${base_url}Document1/UpdateDoc1`, data);
    if (result)
        return result;
    else
        return null;
}

export const apiGetAllTestingCategory = async () => {
    const result = await axios.get(`${base_url}Document1PeriodicAssessment/GetAllTestingCategory`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetAllFormCategory = async () => {
    const result = await axios.get(`${base_url}Document1PeriodicAssessment/GetAllFormCategory`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetSubMenu1ById = async (id: number) => {
    const result = await axios.get(`${base_url}Document1/GetDoc1ById/${id}`);
    if (result)
        return result;
    else
        return null;
}

export const apiPostSubMenu1 = async (data: any): Promise<any> => {
    const result = await axios.post(`${base_url}Document1/AddDoc1`, data);
    if (result)
        return result;
    else
        return null;
}

export const apiDeleteSubMenu1 = async (data: any) => {
    const result = await axios.delete(`${base_url}Document1/DeleteDoc1/${data}`);
    if (result)
        return result;
    else
        return null;
}


export const apiPostSubMenu1TeachingEquipment = async (data: any, docId: any) => {
    const result = await axios.post(`${base_url}Document1TeachingEquipment/AddDoc1TeachingEquipment`, data);
    if (result)
        return result;
    else
        return null;
}

export const apiPostSubMenu1CuriculumDistribution = async (data: any, docId: any) => {
    const result = await axios.post(`${base_url}Document1CuriculumDistribution/AddDoc1Curiculum`, data);
    if (result)
        return result;
    else
        return null;
}

export const apiPostSubMenu1SelectedTopic = async (data: any, docId: any) => {
    const result = await axios.post(`${base_url}Document1SelectedTopic/AddDoc1SelectedTopic`, data);
    if (result)
        return result;
    else
        return null;
}

export const apiPostSubMenu1SubjectRooms = async (data: any, docId: any) => {
    const result = await axios.post(`${base_url}Document1SubjectRooms/AddDoc1SubjectRoom`, data);
    if (result)
        return result;
    else
        return null;
}

export const apiPostSubMenu1PeriodicAssessment = async (data: any) => {
    const result = await axios.put(`${base_url}Document1PeriodicAssessment/UpdateDoc1PeriodicAssessment`, data);
    if (result)
        return result;
    else
        return null;
}

export const apiGetTotalClassByGradeId = async (data: any) => {
    const result = await axios.get(`${base_url}Document1/GetTotalClassAndStudentByGradeId/${data}`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetTeacherInformation = async (data: any) => {
    const result = await axios.get(`${base_url}Document1/GetTeacherInformation/${data}`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetDocument1ByDepartment = async (data: any) => {
    const result = await axios.get(`${base_url}Document1/GetDoc1ByUserDepartment?${data}`);
    if (result)
        return result;
    else
        return null;
}


export const apiGetCurriculumDistributionByDoc1Id = async (docId: any) => {
    const result = await axios.get(`${base_url}Document1CuriculumDistribution/GetDoc1CuriculumByDoc1ID/${docId}`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetSubjectsRoomByDoc1Id = async (docId: any) => {
    const result = await axios.get(`${base_url}Document1SubjectRooms/GetDoc1SubjectRoomByDoc1ID?id=${docId}`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetTeachingEquipmentByDoc1Id = async (docId: any) => {
    const result = await axios.get(`${base_url}Document1TeachingEquipment/GetDoc1TeachingEquipmentByDoc1ID?id=${docId}`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetPeriodicAssessmentByDoc1Id = async (docId: any) => {
    const result = await axios.get(`${base_url}Document1PeriodicAssessment/GetDoc1PeriodicAssessmentByDocument1ID/${docId}`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetSelectedTopicByDoc1Id = async (docId: any) => {
    const result = await axios.get(`${base_url}Document1SelectedTopic/GetDoc1SelectedTopicByDoc1ID/${docId}`);
    if (result)
        return result;
    else
        return null;
}

export const apiDeleteDocument1ForeignTableByDocument1ID = async (docId: any) => {
    const result = await axios.delete(`${base_url}Document1/DeleteDoc1ForeignTableByDoc1ID?id=${docId}`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetSubjectBySpeId = async (speId: any) => {
    const result = await axios.get(`${base_url}Subject/GetSubjectByDepartmentId?id=${speId}`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetcurriculumbySubjectId = async (subId: any) => {
    const result = await axios.get(`${base_url}CurriculumDistribution/GetCurriculumBySubjectId/${subId}`);
    if (result)
        return result;
    else
        return null;
}

export const apiGetSelectedtopicBySubjectId = async (subId: any) => {
    const result = await axios.get(`${base_url}SelectedTopic/GetSelectedTopicBySubjectId/${subId}`);
    if (result)
        return result;
    else
        return null;
}