/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import "./style.scss";
import { Add, Remove } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import generatePDF, { Options } from "react-to-pdf";
import { useAppSelector } from "../../hook/useTypedSelector";
import {
  apiDeleteDocument1ForeignTableByDocument1ID,
  apiDeleteSubMenu1,
  apiGetAllFormCategory,
  apiGetAllTestingCategory,
  apiGetCurriculumDistributionByDoc1Id,
  apiGetPeriodicAssessmentByDoc1Id,
  apiGetSelectedTopicByDoc1Id,
  apiGetSubMenu1ById,
  apiGetSubjectsRoomByDoc1Id,
  apiGetTeacherInformation,
  apiGetTeachingEquipmentByDoc1Id,
  apiGetTotalClassByGradeId,
  apiPostSubMenu1,
  apiPostSubMenu1CuriculumDistribution,
  apiPostSubMenu1PeriodicAssessment,
  apiPostSubMenu1SelectedTopic,
  apiPostSubMenu1SubjectRooms,
  apiPostSubMenu1TeachingEquipment,
  apiUpdateSubMenu1,
} from "../../api/subMenu1";
import { apiGetGrade } from "../../api/grade";
import { Grade } from "../../models/grade";
import { apiGetSubject } from "../../api/subject";
import { Subject } from "../../models/subject";
import { TeachingEquipment } from "../../models/teachingEquipment";
import { apiGetTeachingEquipment } from "../../api/teachingEquipment";
import { SubjectRoom } from "../../models/SubjectRoom";
import { SelectedTopic } from "../../models/SelectedTopic";
import { CurriculumDistribution } from "../../models/CurriculumDistribution";
import { apiGetSubjectRoom } from "../../api/subjectRoom";
import { apiGetSelectedTopic } from "../../api/selectedTopic";
import { apiGetCurriculumDistribution } from "../../api/curriculumDistribution";
import { formatDate } from "../../utils/date";
import { TestingCategory } from "../../models/testingCategory";
import { FormCategory } from "../../models/formCategory";
import { apiGetUser } from "../../api/user";
import { User } from "../../models/User";
import { apiGetSpecializedDepartmentById } from "../../api/specializedDepartment";
import { Department } from "../../models/department";
import { Document1 } from "../../models/document1";
import { TotalClass } from "../../models/totalClass";
import { TeacherInfo } from "../../models/teacherInfo";
import { options } from "../UploadPhuLuc4";
import axios from "axios";
import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";
import { apiGetListIdOfTeacherAndPricipleByDepartmentId, apiPostNotification } from "../../api/notification";
import { apiPostReport } from "../../api/report";

interface Row1 {
  teachingEquipmentId: number | null;
  quantity: number | null;
  description: string;
  note: string;
}
interface Row2 {
  subjectRoomId: number | null;
  quantity: number | null;
  description: string;
  note: string;
}

interface Row3 {
  curriculumId: number | null;
  slot: number | null;
  description: string;
}

interface Row4 {
  selectedTopicsId: number | null;
  slot: number | null;
  description: string;
}

interface Row5 {
  testingCategoryName: string;
  testingCategoryId: number;
  time: number | null;
  date: string;
  description: string;
  formCategoryId: number | null;
}

const defaultRows: Row5[] = [
  {
    testingCategoryName: "Giữa Học kỳ 1",
    testingCategoryId: 1,
    time: null,
    date: "",
    description: "",
    formCategoryId: null,
  },
  {
    testingCategoryName: "Cuối Học kỳ 1",
    testingCategoryId: 2,
    time: null,
    date: "",
    description: "",
    formCategoryId: null,
  },
  {
    testingCategoryName: "Giữa Học kỳ 2",
    testingCategoryId: 3,
    time: null,
    date: "",
    description: "",
    formCategoryId: null,
  },
  {
    testingCategoryName: "Cuối Học kỳ 2",
    testingCategoryId: 4,
    time: null,
    date: "",
    description: "",
    formCategoryId: null,
  },
];

const SubMenu1Detail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [rows1, setRows1] = useState<Row1[]>([
    { teachingEquipmentId: null, quantity: null, description: "", note: "" },
  ]);
  const [rows2, setRows2] = useState<Row2[]>([
    { subjectRoomId: null, quantity: null, description: "", note: "" },
  ]);
  const [rows3, setRows3] = useState<Row3[]>([
    { curriculumId: null, slot: null, description: "" },
  ]);
  const [rows4, setRows4] = useState<Row4[]>([
    { selectedTopicsId: null, slot: null, description: "" },
  ]);
  const [rows5, setRows5] = useState<Row5[]>(defaultRows);
  const [login, setLogin] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openDeny, setOpenDeny] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [displayAddRow, setDisplayAddRow] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachingEquipment, setTeachingEquipment] = useState<
    TeachingEquipment[]
  >([]);
  const [subjectRoom, setSubjectRoom] = useState<SubjectRoom[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<SelectedTopic[]>([]);
  const [curriculumDistribution, setCurriculumDistribution] = useState<
    CurriculumDistribution[]
  >([]);
  const [testingCategory, setTestingCategory] = useState<TestingCategory[]>([]);
  const [specializedDepartment, setSpecializedDepartment] =
    useState<Department>();
  const [formCategory, setFormCategory] = useState<FormCategory[]>([]);
  const [totalClass, setTotalClass] = useState<TotalClass>();
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo>();
  const [userInfoLogin, setUserInfoLogin] = useState<User>();
  const [userInfoDocument, setUserInfoDocument] = useState<User>();
  const [reasonReport, setReasonReport] = useState("");
  const [descriptionRp, setDescriptionRp] = useState("");

  const [count, setCount] = useState(0);
  const [truong, setTruong] = useState("");
  const [to, setTo] = useState("");
  const [hoadDong, setHoatDong] = useState<number | null>(null);
  const [khoiLop, setKhoiLop] = useState<number | null>(null);
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [soLop, setSoLop] = useState("");
  const [soHocSinh, setSoHocSinh] = useState("");
  const [soHocSinhselectedTopicsId, setSoHocSinhselectedTopicsId] =
    useState("");
  const [soGiaoVien, setSoGiaoVien] = useState("");
  const [caoDang, setCaoDang] = useState("");
  const [daiHoc, setDaiHoc] = useState("");
  const [trenDaiHoc, setTrenDaiHoc] = useState("");
  const [tot, setTot] = useState("");
  const [kha, setKha] = useState("");
  const [chuaDat, setChuaDat] = useState("");
  const [documentId, setDocumentId] = useState<number | null>(null);
  const [document1Info, setDocument1Info] = useState<Document1>();
  const [principleAndTeacher, setPrincipleAndTeacher] = useState<any>();
  const [hostByList, setHostByList] = useState<any>();

  useEffect(() => {
    const fecthPrincipleAndTeacher = async () => {
      if (specializedDepartment?.id) {
        const res = await apiGetListIdOfTeacherAndPricipleByDepartmentId(
          specializedDepartment?.id
        );
        if (res && res.data) {
          const resData: any = res.data;
          setPrincipleAndTeacher(resData);
        }
      }
    };
    fecthPrincipleAndTeacher()
  }, [specializedDepartment?.id])

  const getTargetElement = () => document.getElementById("main-content");

  const downloadPdf = async () => {
    try {
      const pdf = await generatePDF(getTargetElement, options);
      const formData = new FormData();
      formData.append("files", pdf.output("blob"), "document.pdf");

      const response = await axios.post(
        "https://localhost:7241/api/S3FileUpload/upload?prefix=doc1%2F",
        formData
      );
      if (response?.status === 200) {
        const res = await apiUpdateSubMenu1({
          id: documentId,
          linkFile: response?.data,
          subjectId: hoadDong,
          gradeId: khoiLop,
          userId: user?.userId,
        });
        if (res && documentId) {
          setDisplayAddRow(!displayAddRow);
          alert("Thành công! Hãy chờ đợi trong giây lát để chuyển trang");
          navigate(`/sub-menu-1/detail-view/${documentId}`);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUserInfoLogin = async () => {
      if (user) {
        const res = await apiGetUser(user?.userId);
        if (res && res.data) {
          const userData: any = res.data;
          setUserInfoLogin(userData);
        }
      }
    };
    fetchUserInfoLogin();
  }, [user]);

  useEffect(() => {
    const fetchSpecializedDepartmentById = async () => {
      if (!location.pathname.split("/")[3]) {
        if (userInfoLogin) {
          const res = await apiGetSpecializedDepartmentById(
            userInfoLogin?.departmentId
          );
          if (res && res.data) {
            const departmentData: any = res.data;
            setSpecializedDepartment(departmentData);
          }
        }
      } else if (location.pathname.split("/")[3]) {
        const fecthDoc1 = await apiGetSubMenu1ById(
          parseInt(location.pathname.split("/")[3])
        );
        if (fecthDoc1 && fecthDoc1.data) {
          const doc1Data: any = fecthDoc1.data;
          setDocument1Info(doc1Data);
          const fecthUserResult = await apiGetUser(doc1Data?.userId);
          if (fecthUserResult && fecthUserResult.data) {
            const userData: any = fecthUserResult.data;
            setUserInfoDocument(userData);
            const res = await apiGetSpecializedDepartmentById(
              userData?.departmentId
            );
            if (res && res.data) {
              const departmentData: any = res.data;
              setSpecializedDepartment(departmentData);
            }
          }
        }
      }
    };

    const fetchGrade = async () => {
      const res = await apiGetGrade();
      if (res && res.data) {
        const gradeData: Grade[] = res.data;
        setGrades(gradeData);
      }
    };

    const fetchSubject = async () => {
      const res = await apiGetSubject();
      if (res && res.data) {
        const subjectData: Subject[] = res.data;
        setSubjects(subjectData);
      }
    };

    const fetchTeachingEquipment = async () => {
      const res = await apiGetTeachingEquipment();
      if (res && res.data) {
        const teachingEquipmentData: TeachingEquipment[] = res.data;
        setTeachingEquipment(teachingEquipmentData);
      }
    };

    const fetchSubjectRoom = async () => {
      const res = await apiGetSubjectRoom();
      if (res && res.data) {
        const subjectRoomData: SubjectRoom[] = res.data;
        setSubjectRoom(subjectRoomData);
      }
    };

    const fetchSelectedTopic = async () => {
      const res = await apiGetSelectedTopic();
      if (res && res.data) {
        const selectedTopicData: SelectedTopic[] = res.data;
        setSelectedTopic(selectedTopicData);
      }
    };

    const fetchCurriculumDistribution = async () => {
      const res = await apiGetCurriculumDistribution();
      if (res && res.data) {
        const curriculumDistributionData: CurriculumDistribution[] = res.data;
        setCurriculumDistribution(curriculumDistributionData);
      }
    };

    const fetchTestingCategory = async () => {
      const res = await apiGetAllTestingCategory();
      if (res && res.data) {
        const testingCategoryData: TestingCategory[] = res.data;
        setTestingCategory(testingCategoryData);
      }
    };

    const fetchFormCategory = async () => {
      const res = await apiGetAllFormCategory();
      if (res && res.data) {
        const FormCategoryData: FormCategory[] = res.data;
        setFormCategory(FormCategoryData);
      }
    };

    fetchGrade();
    fetchSubject();
    fetchTeachingEquipment();
    fetchSelectedTopic();
    fetchSubjectRoom();
    fetchCurriculumDistribution();
    fetchTestingCategory();
    fetchFormCategory();
    fetchSpecializedDepartmentById();
  }, [location.pathname, userInfoLogin]);

  useEffect(() => {
    if (location.pathname.split("/")[3]) {
      const fetchTeachingEquipmentByDocId = async () => {
        const res = await apiGetTeachingEquipmentByDoc1Id(
          parseInt(location.pathname.split("/")[3])
        );
        if (res && res.data) {
          const rowData: Row1[] = res.data;
          setRows1(rowData);
        }
      };

      const fetchPeriodicAssessmentByDocId = async () => {
        const res = await apiGetPeriodicAssessmentByDoc1Id(
          parseInt(location.pathname.split("/")[3])
        );
        if (res && res.data) {
          const rowData: Row5[] = res.data;
          setRows5(rowData);
        }
      };

      const fetchSelectedTopicByDocId = async () => {
        const res = await apiGetSelectedTopicByDoc1Id(
          parseInt(location.pathname.split("/")[3])
        );
        if (res && res.data) {
          const rowData: Row4[] = res.data;
          setRows4(rowData);
        }
      };

      const fetchSubjectsRoomByDocId = async () => {
        const res = await apiGetSubjectsRoomByDoc1Id(
          parseInt(location.pathname.split("/")[3])
        );
        if (res && res.data) {
          const rowData: Row2[] = res.data;
          setRows2(rowData);
        }
      };

      const fetchCurriculumDistributionByDocId = async () => {
        const res = await apiGetCurriculumDistributionByDoc1Id(
          parseInt(location.pathname.split("/")[3])
        );
        if (res && res.data) {
          const rowData: Row3[] = res.data;
          setRows3(rowData);
        }
      };
      fetchTeachingEquipmentByDocId();
      fetchPeriodicAssessmentByDocId();
      fetchSelectedTopicByDocId();
      fetchSubjectsRoomByDocId();
      fetchCurriculumDistributionByDocId();
    }
  }, [location.pathname]);

  useEffect(() => {
    let gradeIdInit;
    if (khoiLop) gradeIdInit = khoiLop;
    if (document1Info?.gradeId) {
      if (count === 0) {
        gradeIdInit = document1Info?.gradeId;
        setCount(count + 1);
      }
    }
    if (gradeIdInit) {
      const fecthTotalClass = async () => {
        const res = await apiGetTotalClassByGradeId(gradeIdInit);
        if (res && res.data) {
          const totalClassData: TotalClass = res.data;
          setTotalClass(totalClassData);
        }
      };
      fecthTotalClass();
    }
  }, [count, document1Info?.gradeId, khoiLop]);

  useEffect(() => {
    if (specializedDepartment) {
      const fecthTeacherInfo = async () => {
        const res = await apiGetTeacherInformation(specializedDepartment?.id);
        if (res && res.data) {
          const teacherInfoData: TeacherInfo = res.data;
          setTeacherInfo(teacherInfoData);
        }
      };
      fecthTeacherInfo();
    }
  }, [specializedDepartment]);

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      if (document1Info?.id) {
        setDocumentId(document1Info.id);
        setHoatDong(document1Info.subjectId);
        setKhoiLop(document1Info.gradeId);
      } else {
        setDocumentId(null);
      }
    }
  }, [location.pathname, document1Info]);

  useEffect(() => {
    setSelectWidth();

    const sel = document.getElementById("grades") as HTMLSelectElement;
    if (sel) {
      sel.addEventListener("change", setSelectWidth);
    }

    return () => {
      if (sel) {
        sel.removeEventListener("change", setSelectWidth);
      }
    };
  }, []);

  const handleClickOpen = async () => {
    setDisplayAddRow(!displayAddRow);
    if (location.pathname.includes("create")) {
      if (khoiLop && user && hoadDong) {
        setOpen(true);
        const post = await apiPostSubMenu1({
          name: "KẾ HOẠCH DẠY HỌC CỦA TỔ CHUYÊN MÔN MÔN HỌC/HOẠT ĐỘNG GIÁO DỤC",
          subjectId: hoadDong,
          gradeId: khoiLop,
          userId: user.userId,
          note: "",
          status: true,
          approveByName: "",
          isApprove: 1,
        });
        if (post) {
          setDocumentId(post?.data?.id);
          await apiPostNotification({
            receiveBy: principleAndTeacher?.principle || [],
            sentBy: user?.userId,
            titleName: `${post?.data?.name} ĐÃ ĐƯỢC ĐĂNG TẢI, HÃY XÉT DUYỆT`,
            message: `${post?.data?.name} ĐÃ ĐƯỢC ĐĂNG TẢI, HÃY XÉT DUYỆT`,
            docType: 1,
            docId: post?.data?.id,
          });
        }
      } else alert("Nhập đầy đủ thông tin!");
    } else {
      if (khoiLop && user && hoadDong) {
        setOpen(true);
        await apiPostNotification({
          receiveBy: principleAndTeacher?.principle || [],
          sentBy: user?.userId,
          titleName: `${document1Info?.name} ĐÃ ĐƯỢC CHỈNH SỬA, HÃY XÉT DUYỆT`,
          message: `${document1Info?.name} ĐÃ ĐƯỢC CHỈNH SỬA, HÃY XÉT DUYỆT`,
          docType: 1,
          docId: document1Info?.id,
        });
      } else alert("Nhập đầy đủ thông tin!");
    }
  };

  const handleClickOpen1 = async () => {
    setDisplayAddRow(!displayAddRow);
    if (khoiLop && user && hoadDong) {
      setOpen(true);
      const post = await apiPostSubMenu1({
        name: "KẾ HOẠCH DẠY HỌC CỦA TỔ CHUYÊN MÔN MÔN HỌC/HOẠT ĐỘNG GIÁO DỤC",
        subjectId: hoadDong,
        gradeId: khoiLop,
        userId: user.userId,
        note: "",
        status: true,
        approveByName: "",
        isAprrove: 2,
      });
      if (post) {
        setDocumentId(post?.data?.id);
      }
    } else alert("Nhập đầy đủ thông tin!");
  };

  const handleClose = async () => {
    if (location.pathname.includes("create")) {
      setDisplayAddRow(!displayAddRow);
      setOpen(false);
      try {
        await apiDeleteSubMenu1(documentId);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleClickOpenAccept = () => {
    setOpenAccept(true);
  };

  const handleCloseAccept = () => {
    setOpenAccept(false);
  };

  const handleClickOpenDeny = () => {
    setOpenDeny(true);
  };

  const handleCloseDeny = () => {
    setOpenDeny(false);
  };

  const handleClickOpenReport = () => {
    setOpenReport(true);
  };

  const handleCloseReport = () => {
    setOpenReport(false);
  };

  const handleSubmitReport = async () => {
    const rp = {
      userId: parseInt(user?.userId),
      doctype: 1,
      docId: document1Info?.id,
      message: reasonReport,
      description: descriptionRp,
    };
    await apiPostReport(rp);
    setOpenReport(false);
  };

  const handleClickOpenRemove = () => {
    setOpenRemove(true);
  };

  const handleCloseRemove = () => {
    setOpenRemove(false);
  };

  const handleClickSave = () => {
    navigate(`/sub-menu-1/detail-edit/${location.pathname.split("/")[3]}`);
  };

  const handleClickAdd = () => {
    navigate(`/sub-menu-1/detail-create`);
  };

  const handleClickCreate = () => {
    navigate(`/sub-menu-3/detail-create/${location.pathname.split("/")[3]}`);
  };

  const handleAddRow1 = () => {
    const newRow = {
      teachingEquipmentId: null,
      quantity: null,
      description: "",
      note: "",
    };
    setRows1([...rows1, newRow]);
  };
  const handleAddRow2 = () => {
    const newRow = {
      subjectRoomId: null,
      quantity: null,
      description: "",
      note: "",
    };
    setRows2([...rows2, newRow]);
  };
  const handleAddRow3 = () => {
    const newRow = {
      curriculumId: null,
      slot: null,
      description: "",
    };
    setRows3([...rows3, newRow]);
  };
  const handleAddRow4 = () => {
    const newRow = {
      selectedTopicsId: null,
      slot: null,
      description: "",
    };
    setRows4([...rows4, newRow]);
  };

  const handleRemoveRow1 = () => {
    if (rows1.length > 1) {
      const updatedRows = [...rows1];
      updatedRows.pop();
      setRows1(updatedRows);
    }
  };

  const handleRemoveRow2 = () => {
    if (rows2.length > 1) {
      const updatedRows = [...rows2];
      updatedRows.pop();
      setRows2(updatedRows);
    }
  };

  const handleRemoveRow3 = () => {
    if (rows3.length > 1) {
      const updatedRows = [...rows3];
      updatedRows.pop();
      setRows3(updatedRows);
    }
  };

  const handleRemoveRow4 = () => {
    if (rows3.length > 1) {
      const updatedRows = [...rows4];
      updatedRows.pop();
      setRows4(updatedRows);
    }
  };

  const handleAddDoc1 = async (documentId: any) => {
    if (location.pathname.includes("edit"))
      await apiDeleteDocument1ForeignTableByDocument1ID(documentId);
    if (rows1 && rows2 && rows3 && rows4 && rows5) {
      const rows1WithDocumentId = rows1.map((row) => ({
        ...row,
        document1Id: documentId,
      }));
      const res1 = await apiPostSubMenu1TeachingEquipment(
        rows1WithDocumentId,
        documentId
      );
      const rows2WithDocumentId = rows2.map((row) => ({
        ...row,
        document1Id: documentId,
      }));
      const res2 = await apiPostSubMenu1SubjectRooms(
        rows2WithDocumentId,
        documentId
      );
      const rows3WithDocumentId = rows3.map((row) => ({
        ...row,
        document1Id: documentId,
      }));
      const res3 = await apiPostSubMenu1CuriculumDistribution(
        rows3WithDocumentId,
        documentId
      );
      const rows4WithDocumentId = rows4.map((row) => ({
        ...row,
        document1Id: documentId,
      }));
      const res4 = await apiPostSubMenu1SelectedTopic(
        rows4WithDocumentId,
        documentId
      );
      const rows5WithDocumentId = rows5.map((row) => ({
        ...row,
        document1Id: documentId,
      }));
      const res5 = await apiPostSubMenu1PeriodicAssessment(rows5WithDocumentId);
      if (res1 && res2 && res3 && res4 && res5) {
        downloadPdf();
      }
    }
    setOpen(false);
  };

  return (
    <div className="sub-menu-container justify-content-center align-items-center" style={{ minWidth: "30rem", justifyContent: "center", alignItems: "center", }}>
      {location.pathname?.includes("create") ||
        location.pathname?.includes("edit") ? (
        <div>
          <div id="main-content">
            <div className="sub-menu-content">
              <div className="sub-menu-content-header">
                <strong className="phu-luc">Phụ lục I</strong>
                <div className="sub-menu-content-header-title">
                  <strong className="sub-menu-content-header-title-main">
                    KHUNG KẾ HOẠCH DẠY HỌC MÔN HỌC CỦA TỔ CHUYÊN MÔN
                  </strong>
                  <div className="sub-menu-content-header-title-sub">
                    <i>
                      (Kèm theo Công văn số 5512/BGDĐT-GDTrH ngày 18 tháng 12
                      năm 2020 của Bộ GDĐT)
                    </i>
                  </div>
                </div>
                <div className="sub-menu-content-header-infomation">
                  <div className="sub-menu-content-header-infomation-detail">
                    <div>
                      {" "}
                      <div>
                        <strong>TRƯỜNG: </strong>
                        <input
                          type="text"
                          placeholder="..........."
                          onChange={(e) => setTruong(e.target.value)}
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div>
                        <strong>TỔ: </strong>
                        {specializedDepartment?.name}
                      </div>
                    </div>
                  </div>
                  <div className="sub-menu-content-header-infomation-slogan">
                    <div>
                      <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong>
                    </div>
                    <div>
                      <strong>Độc lập - Tự do - Hạnh phúc</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sub-menu-content-title">
                <div>
                  <strong>KẾ HOẠCH DẠY HỌC CỦA TỔ CHUYÊN MÔN</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div>
                    <strong>MÔN HỌC/HOẠT ĐỘNG GIÁO DỤC</strong>

                    <select
                      id="grades"
                      style={{
                        height: "25px",
                        marginLeft: "4px",
                        border: "none",
                        outline: "none",
                        fontSize: "inherit",
                        fontFamily: "Times New Roman,Times",
                        fontWeight: "bold",
                      }}
                      onChange={(e) => {
                        if (location.pathname.includes("create"))
                          setHoatDong(parseInt(e.target.value));
                      }}
                      value={document1Info?.subjectId ?? ""}
                    >
                      <option value="" disabled>
                        Chọn môn học
                      </option>
                      {subjects?.map((item) => (
                        <option value={item?.id}>{item?.name}</option>
                      ))}
                    </select>

                    {/* <input type="text" placeholder='..............' style={{ width: "50px" }} onChange={e => setHoatDong(e.target.value)} /> */}
                  </div>
                  <div>
                    <strong>, KHỐI LỚP</strong>
                    <select
                      id="grades"
                      style={{
                        width: "70px",
                        height: "25px",
                        marginLeft: "4px",
                        border: "none",
                        outline: "none",
                        fontSize: "inherit",
                        fontFamily: "Times New Roman,Times",
                        fontWeight: "bold",
                      }}
                      onChange={(e) => {
                        if (location.pathname.includes("create"))
                          setKhoiLop(parseInt(e.target.value));
                      }}
                      value={document1Info?.gradeId ?? ""}
                    >
                      <option value="" disabled>
                        Chọn lớp
                      </option>
                      {grades?.map((item) => (
                        <option value={item?.id}>
                          <strong>{item?.name}</strong>
                        </option>
                      ))}
                    </select>
                    {/* <input type="number" placeholder='...........' style={{ width: "50px" }} onChange={e => setKhoiLop(e.target.value)} /> */}
                  </div>
                </div>
                <div>(Năm học 2023 - 2024)</div>
              </div>

              <div className="sub-menu-content-main">
                <div className="sub-menu-content-main-feature">
                  <div className="sub-menu-content-main-feature-item-last">
                    <div>
                      <strong>I. Đặc điểm tình hình</strong>
                    </div>
                  </div>
                  <div className="sub-menu-content-main-feature-item">
                    <div>
                      <strong>1. Số lớp: </strong>
                      {totalClass?.totalClass}
                    </div>
                    <div style={{ marginLeft: "8px" }}>
                      <strong>Số học sinh: </strong>
                      {totalClass?.totalStudent}
                    </div>
                    <div style={{ marginLeft: "8px" }}>
                      <strong>Số học sinh học chuyên để lựa chọn</strong>(nếu
                      có): {totalClass?.totalStudentSelected}
                    </div>
                  </div>
                  <div className="sub-menu-content-main-feature-item">
                    <div>
                      <strong>2. Tình hình đội ngũ: </strong>
                    </div>
                    <div style={{ marginLeft: "8px" }}>
                      <strong>Số giáo viên: </strong>
                      {teacherInfo?.totalTeacher[0]?.userCount || 0}
                    </div>
                    <div style={{ display: "flex", marginLeft: "8px" }}>
                      <strong>Trình độ đào tạo:</strong>
                      <div style={{ marginLeft: "8px" }}>
                        <strong>Cao đẳng: </strong>
                        {
                          teacherInfo?.totalTeacherLevelOfTrainning[0]
                            ?.userCount || 0
                        }
                      </div>
                      <div style={{ marginLeft: "8px" }}>
                        <strong>; Đại học: </strong>
                        {
                          teacherInfo?.totalTeacherLevelOfTrainning[1]
                            ?.userCount || 0
                        }
                      </div>
                      <div style={{ marginLeft: "8px" }}>
                        <strong>; Trên đại học: </strong>
                        {
                          teacherInfo?.totalTeacherLevelOfTrainning[2]
                            ?.userCount || 0
                        }
                      </div>
                    </div>
                  </div>
                  <div
                    className="sub-menu-content-main-feature-item"
                    style={{ justifyContent: "flex-end" }}
                  >
                    <div>
                      <strong>Mức độ đạt chuẩn nghề nghiệp giáo viên: </strong>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div>
                        Tốt:{" "}
                        {
                          teacherInfo?.totalTeacherProfessionalStandard[0]
                            ?.userCount || 0
                        }
                      </div>
                      <div style={{ marginLeft: "8px" }}>
                        ; Khá:{" "}
                        {
                          teacherInfo?.totalTeacherProfessionalStandard[1]
                            ?.userCount || 0
                        }
                      </div>
                      <div style={{ marginLeft: "8px" }}>
                        ; Chưa đạt:{" "}
                        {
                          teacherInfo?.totalTeacherProfessionalStandard[2]
                            ?.userCount || 0
                        }
                      </div>
                    </div>
                  </div>
                  <div className="sub-menu-content-main-feature-table">
                    <div>
                      <strong>3. Thiết bị dạy học </strong> (Trình bày cụ thể
                      các thiết bị dạy học có thể sử dụng để tổ chức dạy học môn
                      học/hoạt động giáo dục)
                    </div>
                    <TableContainer
                      component={Paper}
                      className="table-list-sub-menu"
                    >
                      <Table
                        sx={{ minWidth: 450, fontSize: "12px", border: 1 }}
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow sx={{ th: { border: 1 } }}>
                            <TableCell align="center">STT</TableCell>
                            <TableCell align="center">
                              Thiết bị dạy học
                            </TableCell>
                            <TableCell align="center">Số lượng</TableCell>
                            <TableCell align="center">
                              Các bài thí nghiệm thực hành
                            </TableCell>
                            <TableCell align="center">Ghi chú</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows1.map((row, index) => (
                            <Tooltip
                              key={index}
                              disableFocusListener
                              placement="right"
                              title={
                                <h2
                                  onClick={() => {
                                    const updatedRows = [...rows1];
                                    updatedRows.splice(index, 1);
                                    setRows1(updatedRows);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  Xóa hàng
                                </h2>
                              }
                            >
                              <TableRow key={index} sx={{ td: { border: 1 } }}>
                                <TableCell align="center">
                                  {index + 1}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  style={{ minWidth: "200px" }}
                                >
                                  <select
                                    id="teachingEquipment"
                                    style={{
                                      width: "200px",
                                      height: "40px",
                                      marginLeft: "4px",
                                      border: "none",
                                      outline: "none",
                                    }}
                                    value={row.teachingEquipmentId ?? ""}
                                    onChange={(e) => {
                                      const newValue = parseInt(e.target.value);
                                      const updatedRows = [...rows1];
                                      updatedRows[index].teachingEquipmentId =
                                        newValue;
                                      setRows1(updatedRows);
                                    }}
                                  >
                                    <option value="" disabled>
                                      Chọn thiết bị dạy học
                                    </option>
                                    {teachingEquipment?.map((item) => (
                                      <option value={item?.id}>
                                        {item?.name}
                                      </option>
                                    ))}
                                  </select>
                                </TableCell>
                                <TableCell
                                  align="center"
                                  style={{ width: "80px" }}
                                >
                                  <textarea
                                    value={row.quantity ?? ""}
                                    onChange={(e) => {
                                      const newValue = parseInt(e.target.value);
                                      const updatedRows = [...rows1];
                                      updatedRows[index].quantity = newValue;
                                      setRows1(updatedRows);
                                    }}
                                    style={{ textAlign: "center" }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <textarea
                                    value={row.description}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      const updatedRows = [...rows1];
                                      updatedRows[index].description = newValue;
                                      setRows1(updatedRows);
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <textarea
                                    value={row.note}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      const updatedRows = [...rows1];
                                      updatedRows[index].note = newValue;
                                      setRows1(updatedRows);
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            </Tooltip>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <div
                      className="add-row-button"
                      style={{ display: displayAddRow ? "none" : "" }}
                    >
                      {" "}
                      <Add
                        style={{ color: "black" }}
                        className="add-row-icon"
                        onClick={handleAddRow1}
                      />
                      <Remove
                        style={{ color: "black" }}
                        className="add-row-icon"
                        onClick={handleRemoveRow1}
                      />
                    </div>
                  </div>
                  <div className="sub-menu-content-main-feature-table">
                    <div>
                      <strong>
                        4. Phòng học bộ môn/phòng thí nghiệm/phòng đa năng/sân
                        chơi, bài tập
                      </strong>{" "}
                      (Trình bày cụ thể các phòng thí nghiệm/phòng bộ môn/phòng
                      đa năng/sân chơi/bãi tập có thể sử dụng để tổ chức dạy học
                      môn học/hoạt động giáo dục)
                    </div>
                    <TableContainer
                      component={Paper}
                      className="table-list-sub-menu"
                    >
                      <Table
                        sx={{ minWidth: 450, fontSize: "12px", border: 1 }}
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow sx={{ th: { border: 1 } }}>
                            <TableCell align="center">STT</TableCell>
                            <TableCell align="center">Tên phòng</TableCell>
                            <TableCell align="center">Số lượng</TableCell>
                            <TableCell align="center">
                              Các bài thí nghiệm thực hành
                            </TableCell>
                            <TableCell align="center">Ghi chú</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows2.map((row, index) => (
                            <Tooltip
                              key={index}
                              disableFocusListener
                              placement="right"
                              title={
                                <h2
                                  onClick={() => {
                                    const updatedRows = [...rows2];
                                    updatedRows.splice(index, 1);
                                    setRows2(updatedRows);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  Xóa hàng
                                </h2>
                              }
                            >
                              <TableRow key={index} sx={{ td: { border: 1 } }}>
                                <TableCell align="center">
                                  {index + 1}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  style={{ minWidth: "200px" }}
                                >
                                  <select
                                    id="subjectRoomId"
                                    style={{
                                      width: "200px",
                                      height: "40px",
                                      marginLeft: "4px",
                                      border: "none",
                                      outline: "none",
                                    }}
                                    value={row.subjectRoomId ?? ""}
                                    onChange={(e) => {
                                      const newValue = parseInt(e.target.value);
                                      const updatedRows = [...rows2];
                                      updatedRows[index].subjectRoomId =
                                        newValue;
                                      setRows2(updatedRows);
                                    }}
                                  >
                                    <option value="" disabled>
                                      Chọn phòng học
                                    </option>
                                    {subjectRoom?.map((item) => (
                                      <option value={item?.id}>
                                        {item?.name}
                                      </option>
                                    ))}
                                  </select>
                                </TableCell>
                                <TableCell
                                  align="center"
                                  style={{ width: "80px" }}
                                >
                                  <textarea
                                    value={row.quantity ?? ""}
                                    onChange={(e) => {
                                      const newValue = parseInt(e.target.value);
                                      const updatedRows = [...rows2];
                                      updatedRows[index].quantity = newValue;
                                      setRows2(updatedRows);
                                    }}
                                    style={{ textAlign: "center" }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <textarea
                                    value={row.description}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      const updatedRows = [...rows2];
                                      updatedRows[index].description = newValue;
                                      setRows2(updatedRows);
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <textarea
                                    value={row.note}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      const updatedRows = [...rows2];
                                      updatedRows[index].note = newValue;
                                      setRows2(updatedRows);
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            </Tooltip>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <div
                      className="add-row-button"
                      style={{ display: displayAddRow ? "none" : "" }}
                    >
                      <Add
                        style={{ color: "black" }}
                        className="add-row-icon"
                        onClick={handleAddRow2}
                      />
                      <Remove
                        style={{ color: "black" }}
                        className="add-row-icon"
                        onClick={handleRemoveRow2}
                      />
                    </div>
                  </div>
                </div>

                <div className="sub-menu-content-main-feature">
                  <div className="sub-menu-content-main-feature-item-last">
                    <div>
                      <strong>II. Kế hoạch dạy học</strong>
                    </div>
                  </div>
                  <div className="sub-menu-content-main-feature-table">
                    <div>
                      <strong>1. Phân phối chương trình </strong>
                    </div>
                    <TableContainer
                      component={Paper}
                      className="table-list-sub-menu"
                    >
                      <Table
                        sx={{ minWidth: 450, fontSize: "12px", border: 1 }}
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow sx={{ th: { border: 1 } }}>
                            <TableCell align="center">STT</TableCell>
                            <TableCell align="center">Bài học</TableCell>
                            <TableCell align="center">Số tiết</TableCell>
                            <TableCell align="center">
                              Yêu cầu cần đạt
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows3.map((row, index) => (
                            <Tooltip
                              key={index}
                              disableFocusListener
                              placement="right"
                              title={
                                <h2
                                  onClick={() => {
                                    const updatedRows = [...rows3];
                                    updatedRows.splice(index, 1);
                                    setRows3(updatedRows);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  Xóa hàng
                                </h2>
                              }
                            >
                              <TableRow key={index} sx={{ td: { border: 1 } }}>
                                <TableCell align="center">
                                  {index + 1}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  style={{ minWidth: "300px" }}
                                >
                                  <select
                                    id="curriculumDistribution"
                                    style={{
                                      width: "300px",
                                      height: "40px",
                                      marginLeft: "4px",
                                      border: "none",
                                      outline: "none",
                                    }}
                                    value={row.curriculumId ?? ""}
                                    onChange={(e) => {
                                      const newValue = parseInt(e.target.value);
                                      const updatedRows = [...rows3];
                                      updatedRows[index].curriculumId =
                                        newValue;
                                      setRows3(updatedRows);
                                    }}
                                  >
                                    <option value="" disabled>
                                      Chọn phân phối chương trình
                                    </option>
                                    {curriculumDistribution?.map((item) => (
                                      <option value={item?.id}>
                                        {item?.name}
                                      </option>
                                    ))}
                                  </select>
                                </TableCell>
                                <TableCell
                                  align="center"
                                  style={{ width: "80px" }}
                                >
                                  <textarea
                                    value={row.slot ?? ""}
                                    onChange={(e) => {
                                      const newValue = parseInt(e.target.value);
                                      const updatedRows = [...rows3];
                                      updatedRows[index].slot = newValue;
                                      setRows3(updatedRows);
                                    }}
                                    style={{ textAlign: "center" }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <textarea
                                    value={row.description}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      const updatedRows = [...rows3];
                                      updatedRows[index].description = newValue;
                                      setRows3(updatedRows);
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            </Tooltip>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <div
                      className="add-row-button"
                      style={{ display: displayAddRow ? "none" : "" }}
                    >
                      <Add
                        style={{ color: "black" }}
                        className="add-row-icon"
                        onClick={handleAddRow3}
                      />
                      <Remove
                        style={{ color: "black" }}
                        className="add-row-icon"
                        onClick={handleRemoveRow3}
                      />
                    </div>
                  </div>
                  <div className="sub-menu-content-main-feature-table">
                    <div>
                      <strong>
                        2. Chuyên đề lựa chọn (đối với cấp trung học phổ thông)
                      </strong>
                    </div>
                    <TableContainer
                      component={Paper}
                      className="table-list-sub-menu"
                    >
                      <Table
                        sx={{ minWidth: 450, fontSize: "12px", border: 1 }}
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow sx={{ th: { border: 1 } }}>
                            <TableCell align="center">STT</TableCell>
                            <TableCell align="center">Chuyên đề</TableCell>
                            <TableCell align="center">Số tiết</TableCell>
                            <TableCell align="center">
                              Yêu cầu cần đạt
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows4.map((row, index) => (
                            <Tooltip
                              key={index}
                              disableFocusListener
                              placement="right"
                              title={
                                <h2
                                  onClick={() => {
                                    const updatedRows = [...rows4];
                                    updatedRows.splice(index, 1);
                                    setRows4(updatedRows);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  Xóa hàng
                                </h2>
                              }
                            >
                              <TableRow key={index} sx={{ td: { border: 1 } }}>
                                <TableCell align="center">
                                  {index + 1}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  style={{ minWidth: "300px" }}
                                >
                                  <select
                                    id="selectedTopic"
                                    style={{
                                      width: "300px",
                                      height: "40px",
                                      marginLeft: "4px",
                                      border: "none",
                                      outline: "none",
                                    }}
                                    value={row.selectedTopicsId ?? ""}
                                    onChange={(e) => {
                                      const newValue = parseInt(e.target.value);
                                      const updatedRows = [...rows4];
                                      updatedRows[index].selectedTopicsId =
                                        newValue;
                                      setRows4(updatedRows);
                                    }}
                                  >
                                    <option value="" disabled>
                                      Chọn chuyên đề
                                    </option>
                                    {selectedTopic?.map((item) => (
                                      <option value={item?.id}>
                                        {item?.name}
                                      </option>
                                    ))}
                                  </select>
                                </TableCell>
                                <TableCell
                                  align="center"
                                  style={{ width: "80px" }}
                                >
                                  <textarea
                                    value={row.slot ?? ""}
                                    onChange={(e) => {
                                      const newValue = parseInt(e.target.value);
                                      const updatedRows = [...rows4];
                                      updatedRows[index].slot = newValue;
                                      setRows4(updatedRows);
                                    }}
                                    style={{ textAlign: "center" }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <textarea
                                    value={row.description}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      const updatedRows = [...rows4];
                                      updatedRows[index].description = newValue;
                                      setRows4(updatedRows);
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            </Tooltip>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <div
                      className="add-row-button"
                      style={{ display: displayAddRow ? "none" : "" }}
                    >
                      <Add
                        style={{ color: "black" }}
                        className="add-row-icon"
                        onClick={handleAddRow4}
                      />
                      <Remove
                        style={{ color: "black" }}
                        className="add-row-icon"
                        onClick={handleRemoveRow4}
                      />
                    </div>
                  </div>
                  <div className="sub-menu-content-main-feature-table">
                    <div>
                      <strong>3. Kiểm tra, đánh giá định kỳ</strong>
                    </div>
                    <TableContainer
                      component={Paper}
                      className="table-list-sub-menu"
                    >
                      <Table
                        sx={{ minWidth: 450, fontSize: "12px", border: 1 }}
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow sx={{ th: { border: 1 } }}>
                            <TableCell align="center">
                              Bài kiểm tra đánh giá
                            </TableCell>
                            <TableCell align="center">Thời gian</TableCell>
                            <TableCell align="center">Thời điểm</TableCell>
                            <TableCell align="center">
                              Yêu cầu cần đạt
                            </TableCell>
                            <TableCell align="center">Hình thức</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows5.map((row, index) => (
                            <TableRow key={index} sx={{ td: { border: 1 } }}>
                              <TableCell align="center">
                                {row.testingCategoryName}
                              </TableCell>
                              <TableCell align="center">
                                <textarea
                                  value={row.time ?? ""}
                                  onChange={(e) => {
                                    const newValue = parseInt(e.target.value);
                                    const updatedRows = [...rows5];
                                    updatedRows[index].time = newValue;
                                    setRows5(updatedRows);
                                  }}
                                  style={{ textAlign: "center" }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <input
                                  type="date"
                                  value={row.date ? formatDate(row.date) : ""}
                                  onChange={(e) => {
                                    const newValue = e.target.value;
                                    const updatedRows = [...rows5];
                                    updatedRows[index].date = newValue;
                                    setRows5(updatedRows);
                                  }}
                                  style={{ height: "36px" }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <textarea
                                  value={row.description}
                                  onChange={(e) => {
                                    const newValue = e.target.value;
                                    const updatedRows = [...rows5];
                                    updatedRows[index].description = newValue;
                                    setRows5(updatedRows);
                                  }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <select
                                  id="formCategory"
                                  style={{
                                    width: "150px",
                                    height: "40px",
                                    marginLeft: "4px",
                                    border: "none",
                                    outline: "none",
                                  }}
                                  value={row.formCategoryId ?? ""}
                                  onChange={(e) => {
                                    const newValue = parseInt(e.target.value);
                                    const updatedRows = [...rows5];
                                    updatedRows[index].formCategoryId =
                                      newValue;
                                    setRows5(updatedRows);
                                  }}
                                >
                                  <option value="" disabled>
                                    Chọn hình thức
                                  </option>
                                  {formCategory?.map((item) => (
                                    <option value={item?.id}>
                                      {item?.name}
                                    </option>
                                  ))}
                                </select>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sub-menu-content-action">
            <Button onClick={handleClickOpen1}>Lưu bản nháp</Button>
            <Button onClick={handleClickOpen}>Xác nhận xét duyệt</Button>
          </div>
        </div>
      ) : (
        <>
          <embed
            src={document1Info?.linkFile}
            width="100%"
            height="1000px"
            type="application/pdf"
          />

          <div>
            <div className="sub-menu-action">
              <div className="verify" style={{ justifyContent: "center" }}>
                <div style={{ display: "flex", columnGap: "10px" }}>
                  {!location.pathname.includes("-create") && userInfoLogin?.departmentId === userInfoDocument?.departmentId
                    && user?.role === "Teacher" && (
                      // {!location.pathname.includes("-create") && (
                      <div className="action-button" onClick={handleClickCreate}>
                        Tạo khung kế hoạch
                      </div>
                    )}
                  {
                    userInfoLogin?.id === document1Info?.userId && <>
                      <div
                        className="action-button"
                        onClick={
                          location.pathname.includes("add")
                            ? handleClickAdd
                            : handleClickSave
                        }
                      >
                        {location.pathname.includes("create") ? "Tạo mới" : "Sửa"}
                      </div>
                      <div
                        className="action-button"
                        onClick={handleClickOpenRemove}
                      >
                        Xóa
                      </div>
                    </>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="sub-menu-infomation">
            <div className="sub-menu-row">
              <div>
                <i>
                  {document1Info?.isApprove === 3
                    ? "(Tài liệu đã được thẩm định)"
                    : "(Tài liệu chưa được thẩm định)"}
                </i>
              </div>
            </div>
            <div className="sub-menu-row">
              <div>
                <strong>Người gửi: </strong>{" "}
                <u className="underline-blue">{document1Info?.userFullName}</u>
              </div>
            </div>
            <div className="sub-menu-row">
              <div>
                <strong>Ngày gửi: </strong> {document1Info?.createdDate}
              </div>
              <div className="right-action" onClick={handleClickOpenReport}>
                <strong>
                  <u className="underline-blue">Báo cáo tài liệu có sai sót</u>
                </strong>
              </div>
            </div>
          </div>
          <div>
            {
              user?.role === "principle" && <div className="sub-menu-action">
                <div className="verify">
                  <span>Tình trạng thẩm định:</span>
                  <div style={{ display: "flex", columnGap: "10px" }}>
                    <div
                      className="action-button"
                      onClick={handleClickOpenAccept}
                    >
                      Chấp thuận
                    </div>
                    <div className="action-button" onClick={handleClickOpenDeny}>
                      Từ chối
                    </div>
                  </div>
                </div>
              </div>
            }
            <div className="sub-menu-note">
              Ghi chú <br />
              <textarea name="" id="" rows={8}></textarea>
            </div>
          </div>
        </>
      )}
      <Dialog
        open={open}
        onClose={async (event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            handleClose();
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{ textAlign: "center", fontWeight: 600 }}
        >
          Bạn có chắc chắn không
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ textAlign: "center", fontWeight: 600 }}
          >
            Bạn có chắc muốn đưa phụ lục này vào xét duyệt
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            style={{ color: "#000", fontWeight: 600 }}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={() => handleAddDoc1(documentId)}
            className="button-mui"
            autoFocus
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openReport}
        onClose={handleCloseReport}
        maxWidth={"md"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{ textAlign: "center", fontWeight: 600 }}
        >
          Báo cáo tài liệu
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{
              textAlign: "left",
              backgroundColor: "#D9D9D9",
              borderRadius: "20px",
              padding: "20px",
            }}
          >
            <div className="report-row">
              <div className="report-title">Tài liệu</div>
              <div className="report-detail">Giáo án tài liệu A</div>
            </div>
            <div className="report-row">
              <div className="report-title">Lý do báo cáo</div>
              <div
                className="report-detail"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={reasonReport ?? ""}
                  onChange={(e) => setReasonReport(e.target.value)}
                >
                  <FormControlLabel
                    value="Có lỗi kỹ thuật"
                    control={<Radio />}
                    label="Có lỗi kỹ thuật"
                  />
                  <FormControlLabel
                    value="Không dùng để dạy học"
                    control={<Radio />}
                    label="Không dùng để dạy học"
                  />
                  <FormControlLabel
                    value="Vi phạm bản quyền"
                    control={<Radio />}
                    label="Vi phạm bản quyền"
                  />
                  <FormControlLabel
                    value="Lý do khác"
                    control={<Radio />}
                    label="Lý do khác"
                  />
                </RadioGroup>
              </div>
            </div>
            <div className="report-row">
              <div className="report-title">Chi tiết lỗi</div>
              <div className="report-detail">
                <span style={{ whiteSpace: "nowrap" }}>
                  Đề nghị cung cấp lý do và chỉ ra các điểm không chính xác
                </span>
                <br />
                <textarea
                  name=""
                  id=""
                  rows={10}
                  onChange={(e) => setDescriptionRp(e.target.value)}
                />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseReport}
            style={{ color: "#000", fontWeight: 600 }}
          >
            {" "}
            Quay lại trang
          </Button>
          <Button onClick={handleSubmitReport} className="button-mui" autoFocus>
            Gửi báo cáo
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openAccept}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            handleCloseAccept();
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{ textAlign: "center", fontWeight: 600 }}
        >
          Bạn có chắc chắn không
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ textAlign: "center", fontWeight: 600 }}
          >
            Bạn có chắc muốn đưa phụ lục này vào thẩm duyệt
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseAccept}
            style={{ color: "#000", fontWeight: 600 }}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={async () => {
              try {
                await apiUpdateSubMenu1({
                  id: document1Info?.id,
                  subjectId: document1Info?.subjectId,
                  gradeId: document1Info?.gradeId,
                  userId: document1Info?.userId,
                  isApprove: 3,
                  approveBy: user?.userId,
                });
                await apiPostNotification({
                  receiveBy: [document1Info?.userId] || [],
                  sentBy: user?.userId,
                  titleName: `${document1Info?.name} ĐÃ ĐƯỢC CHẤP NHẬN`,
                  message: `${document1Info?.name} ĐÃ ĐƯỢC CHẤP NHẬN`,
                  docType: 1,
                  docId: document1Info?.id,
                });
                await apiPostNotification({
                  receiveBy: hostByList || [],
                  sentBy: user?.userId,
                  titleName: `${document1Info?.name} ĐÃ ĐƯỢC CHẤP NHẬN, HÃY TẠO KHUNG KẾ HOẠCH`,
                  message: `${document1Info?.name} ĐÃ ĐƯỢC CHẤP NHẬN, HÃY TẠO KHUNG KẾ HOẠCH`,
                  docType: 1,
                  docId: document1Info?.id,
                });
              } catch (error) {
                alert("Không thể xét duyệt");
              }
              setOpenAccept(false);
            }}
            className="button-mui"
            autoFocus
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDeny}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            handleCloseDeny();
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{ textAlign: "center", fontWeight: 600 }}
        >
          Bạn có chắc chắn không
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ textAlign: "center", fontWeight: 600 }}
          >
            Bạn có chắc muốn từ chối đưa phụ lục này vào thẩm duyệt
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeny}
            style={{ color: "#000", fontWeight: 600 }}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={async () => {
              try {
                await apiUpdateSubMenu1({
                  id: document1Info?.id,
                  subjectId: document1Info?.subjectId,
                  gradeId: document1Info?.gradeId,
                  userId: document1Info?.userId,
                  isApprove: 4,
                  approveBy: user?.userId,
                });
              } catch (error) {
                alert("Không thể từ chối");
              }
              setOpenDeny(false);
            }}
            className="button-mui"
            autoFocus
          >
            Chắc chắn
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openRemove}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            handleCloseRemove();
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{ textAlign: "center", fontWeight: 600 }}
        >
          Bạn có chắc chắn không
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ textAlign: "center", fontWeight: 600 }}
          >
            Bạn có chắc muốn xóa tài liệu này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseRemove}
            style={{ color: "#000", fontWeight: 600 }}
          >
            Hủy bỏ
          </Button>
          <Button onClick={async () => {
            await apiDeleteSubMenu1(document1Info?.id)
            navigate('/sub-menu/1')
          }}
            className="button-mui" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      <select id="template" style={{ visibility: "hidden" }}>
        <option id="templateOption"></option>
      </select>
    </div>
  );
};
function setSelectWidth() {
  var grades = document.getElementById("grades") as HTMLSelectElement;
  var templateOption = document.getElementById("templateOption") as HTMLElement;
  var template = document.getElementById("template") as HTMLSelectElement;
  if (grades && templateOption) {
    var selectedIndex = grades.selectedIndex;
    var selectedOption = grades.options[selectedIndex];
    templateOption.textContent = selectedOption?.textContent;
    if (template !== undefined) {
      grades.style.width = `${template?.clientWidth + 7}px`;
    }
  }
}

export default SubMenu1Detail;
