import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Grid,
} from "@mui/material";
import "./style.scss";
import { Add, Remove } from "@mui/icons-material";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useLocation, useNavigate } from "react-router-dom";
import { Subject } from "../../models/subject";
import { Class } from "../../models/class";
import { apiGetSubject } from "../../api/subject";
import { apiGetClassByGradeId } from "../../api/class";
import { Document1 } from "../../models/document1";
import {
  apiGetCurriculumDistributionByDoc1Id,
  apiGetSelectedTopicByDoc1Id,
  apiGetSubMenu1ById,
  apiGetSubjectsRoomByDoc1Id,
  apiGetTeachingEquipmentByDoc1Id,
} from "../../api/subMenu1";
import { apiGetUser } from "../../api/user";
import { User } from "../../models/User";
import { useAppSelector } from "../../hook/useTypedSelector";
import { Department } from "../../models/department";
import { apiGetSpecializedDepartmentById } from "../../api/specializedDepartment";
import { TeachingEquipment } from "../../models/teachingEquipment";
import { SubjectRoom } from "../../models/SubjectRoom";
import { CurriculumDistribution } from "../../models/CurriculumDistribution";
import { formatDate } from "../../utils/date";
import {
  apiDeleteDocument3ForeignTableByDocument3ID,
  apiDeleteSubMenu3,
  apiGetSubMenu3ById,
  apiGetSubMenu3CuriculumDistribution,
  apiGetSubMenu3SelectedTopics,
  apiPostSubMenu3,
  apiPostSubMenu3CuriculumDistribution,
  apiPostSubMenu3SelectedTopics,
  apiUpdateSubMenu3,
} from "../../api/subMenu3";
import generatePDF from "react-to-pdf";
import { options } from "../UploadPhuLuc4";
import axios from "axios";
import { SelectedTopic } from "../../models/SelectedTopic";
import { apiPostReport } from "../../api/report";
import {
  apiGetListIdOfTeacherAndPricipleByDepartmentId,
  apiPostNotification,
} from "../../api/notification";

interface Row {
  curriculumId: number | null;
  selectedTopicsId: number | null;
  slot: number | null;
  equipmentId: number[];
  time: string;
  subjectRoomId: string;
}

const SubMenu3Detail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const document1Id = location.pathname.split("/")[3];
  const user = useAppSelector((state) => state.auth.user);

  const [rows1, setRows1] = useState<Row[]>([
    {
      curriculumId: null,
      selectedTopicsId: null,
      equipmentId: [0],
      slot: null,
      time: "",
      subjectRoomId: "",
    },
  ]);
  const [rows2, setRows2] = useState<Row[]>([
    {
      curriculumId: null,
      selectedTopicsId: null,
      equipmentId: [0],
      slot: null,
      time: "",
      subjectRoomId: "",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openDeny, setOpenDeny] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [specializedDepartment, setSpecializedDepartment] =
    useState<Department>();
  const [teachingEquipment, setTeachingEquipment] = useState<
    TeachingEquipment[]
  >([]);
  const [subjectRoom, setSubjectRoom] = useState<SubjectRoom[]>([]);
  const [curriculumDistribution, setCurriculumDistribution] = useState<
    CurriculumDistribution[]
  >([]);
  const [selectedTopics, setSelectedTopics] = useState<SelectedTopic[]>([]);
  const [document1Info, setDocument1Info] = useState<Document1>();
  const [userInfoLogin, setUserInfoLogin] = useState<User>();
  const [documentId, setDocumentId] = useState(null);
  const [userInfoDocument, setUserInfoDocument] = useState<User>();
  const [document3Info, setDocument3Info] = useState<Document1>();
  const [displayAddRow, setDisplayAddRow] = useState(false);
  const [reasonReport, setReasonReport] = useState("");
  const [descriptionRp, setDescriptionRp] = useState("");
  const [principleAndTeacher, setPrincipleAndTeacher] = useState<any>();

  const [truong, setTruong] = useState("");
  const [to, setTo] = useState("");
  const [giaoVien, setGiaoVien] = useState("");
  const [khoiLop, setKhoiLop] = useState("");
  const [toTruong, setToTruong] = useState("");
  const [hieuTruong, setHieuTruong] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [nhiemVuKhac, setNhiemVuKhac] = useState("");

  const getTargetElement = () => document.getElementById("main-content");

  console.log("document3Info: ", document3Info)

  const downloadPdf = async () => {
    try {
      const pdf = await generatePDF(getTargetElement, options);
      const formData = new FormData();
      formData.append("files", pdf.output("blob"), "document.pdf");

      const response = await axios.post(
        "https://localhost:7241/api/S3FileUpload/upload?prefix=doc3%2F",
        formData
      );
      if (response?.status === 200) {
        const res = await apiUpdateSubMenu3(
          {
            id: document3Info?.id ?? documentId,
            document1Id: location.pathname.includes("create") ? parseInt(document1Id) : document3Info?.document1Id,
            linkFile: response?.data,
            userId: user?.userId,
            isApprove: 2,
          },
          documentId
        );
        if (res && (document3Info?.id ?? documentId)) {
          setDisplayAddRow(!displayAddRow);
          alert("Thành công! Hãy chờ đợi trong giây lát để chuyển trang");
          navigate(`/sub-menu-3/detail-view/${(document3Info?.id ?? documentId)}`);
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
    fetchUserInfoLogin();
    fecthPrincipleAndTeacher();
  }, [specializedDepartment?.id, user]);

  useEffect(() => {
    if (!location.pathname.includes("create")) {
      const fecthDoc3 = async () => {
        const res = await apiGetSubMenu3ById(location.pathname.split("/")[3]);
        if (res && res.data) {
          const doc3Data: any = res.data;
          setDocument3Info(doc3Data);
        }
      };
      fecthDoc3();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.includes("create")) {
      const fecthDoc1 = async () => {
        const res = await apiGetSubMenu1ById(
          parseInt(location.pathname.split("/")[3])
        );
        if (res && res.data) {
          const doc1Data: any = res.data;
          setDocument1Info(doc1Data);
        }
      };
      fecthDoc1();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.includes("create")) {
      if (user) setGiaoVien(user.username);
    } else if (location.pathname.includes("edit")) {
      if (document3Info) {
        const fetchAuthor = async () => {
          const res = await apiGetUser(document3Info.userId);
          if (res && res.data) {
            setGiaoVien(res.data.fullName);
          }
        };
        fetchAuthor();
      }
    }
  }, [location.pathname, user, document3Info]);

  useEffect(() => {
    const fetchSpecializedDepartmentById = async () => {

      let document1IdInit = 0;
      if (location.pathname.includes("create"))
        document1IdInit = parseInt(location.pathname.split("/")[3]);
      else if (document3Info) document1IdInit = document3Info?.document1Id;
      if (document1IdInit !== 0) {
        const fecthDoc1 = await apiGetSubMenu1ById(document1IdInit);
        if (fecthDoc1 && fecthDoc1.data) {
          const doc1Data: any = fecthDoc1.data;
          setDocument1Info(doc1Data);
          const fecthUserResult = await apiGetUser(doc1Data?.userId);
          if (fecthUserResult && fecthUserResult.data) {
            const userData: any = fecthUserResult.data;
            console.log("userData: ", userData);
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

    const fetchTeachingEquipment = async () => {
      if (location.pathname.includes("create")) {
        const res = await apiGetTeachingEquipmentByDoc1Id(
          location.pathname.split("/")[3]
        );
        if (res && res.data) {
          const teachingEquipmentData: TeachingEquipment[] = res.data;
          setTeachingEquipment(teachingEquipmentData);
        }
      } else if (location.pathname.includes("edit")) {
        if (document3Info) {
          const res = await apiGetTeachingEquipmentByDoc1Id(
            document3Info?.document1Id
          );
          if (res && res.data) {
            const teachingEquipmentData: TeachingEquipment[] = res.data;
            setTeachingEquipment(teachingEquipmentData);
          }
        }
      }
    };

    const fetchSubjectRoom = async () => {
      if (location.pathname.includes("create")) {
        const res = await apiGetSubjectsRoomByDoc1Id(
          location.pathname.split("/")[3]
        );
        if (res && res.data) {
          const subjectRoomData: SubjectRoom[] = res.data;
          setSubjectRoom(subjectRoomData);
        }
      } else if (location.pathname.includes("edit")) {
        if (document3Info) {
          const res = await apiGetSubjectsRoomByDoc1Id(
            document3Info?.document1Id
          );
          if (res && res.data) {
            const subjectRoomData: SubjectRoom[] = res.data;
            setSubjectRoom(subjectRoomData);
          }
        }
      }
    };

    const fetchCurriculumDistribution = async () => {
      if (location.pathname.includes("create")) {
        const res = await apiGetCurriculumDistributionByDoc1Id(
          location.pathname.split("/")[3]
        );
        if (res && res.data) {
          const curriculumDistributionData: CurriculumDistribution[] = res.data;
          setCurriculumDistribution(curriculumDistributionData);
        }
      } else if (location.pathname.includes("edit")) {
        if (document3Info) {
          const res = await apiGetCurriculumDistributionByDoc1Id(
            document3Info?.document1Id
          );
          if (res && res.data) {
            const curriculumDistributionData: CurriculumDistribution[] =
              res.data;
            setCurriculumDistribution(curriculumDistributionData);
          }
        }
      }
    };

    const fetchSelectedTopics = async () => {
      if (location.pathname.includes("create")) {
        const res = await apiGetSelectedTopicByDoc1Id(
          location.pathname.split("/")[3]
        );
        if (res && res.data) {
          const selectedTopicsData: SelectedTopic[] = res.data;
          setSelectedTopics(selectedTopicsData);
        }
      } else if (location.pathname.includes("edit")) {
        if (document3Info) {
          const res = await apiGetSelectedTopicByDoc1Id(
            document3Info?.document1Id
          );
          if (res && res.data) {
            const selectedTopicsData: SelectedTopic[] = res.data;
            setSelectedTopics(selectedTopicsData);
          }
        }
      }
    };

    fetchSpecializedDepartmentById();
    fetchTeachingEquipment();
    fetchSubjectRoom();
    fetchCurriculumDistribution();
    fetchSelectedTopics();
  }, [document3Info, location.pathname]);

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      const fetchRow1 = async () => {
        const res = await apiGetSubMenu3CuriculumDistribution(
          parseInt(location.pathname.split("/")[3])
        );
        if (res && res.data) {
          const rowData: Row[] = res.data;
          setRows1(rowData);
        }
      };
      const fetchRow2 = async () => {
        const res = await apiGetSubMenu3SelectedTopics(
          parseInt(location.pathname.split("/")[3])
        );
        if (res && res.data) {
          const rowData: Row[] = res.data;
          setRows2(rowData);
        }
      };
      fetchRow1();
      fetchRow2();
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchAllSubjects = async () => {
      const res = await apiGetSubject();
      if (res && res.data) {
        const subjectData: Subject[] = res.data;
        setSubjects(subjectData);
      }
    };

    const fetchClasses = async () => {
      if (document1Info?.gradeId) {
        const res = await apiGetClassByGradeId(document1Info.gradeId);
        if (res && res.data) {
          const classData: Class[] = res.data;
          setClasses(classData);
        }
      }
    };

    fetchAllSubjects();
    fetchClasses();
  }, [document1Info]);

  const handleClickOpen = async () => {
    setDisplayAddRow(!displayAddRow);
    if (location.pathname.includes("create")) {
      if (khoiLop && user) {
        setOpen(true);
        const post = await apiPostSubMenu3({
          name: "KẾ HOẠCH DẠY HỌC CỦA GIÁO VIÊN MÔN HỌC/HOẠT ĐỘNG GIÁO DỤC MÔN " + subjects.find(obj => obj.id === document1Info?.subjectId)?.name.toUpperCase() + ",LỚP " + khoiLop,
          document1Id: document1Id,
          claasName: khoiLop,
          userId: parseInt(user.userId),
          note: "",
          status: true,
          approveByName: "",
          isApprove: 2,
        });
        if (post) {
          setDocumentId(post?.data?.id);
        }
      } else alert("Nhập đầy đủ thông tin!");
    } else {
      if (user) {
        setOpen(true);

      }
    }
  };

  const handleClickOpen1 = async () => {
    setDisplayAddRow(!displayAddRow);
    if (khoiLop && user) {
      setOpen(true);
      const post = await apiPostSubMenu3({
        name: "KẾ HOẠCH DẠY HỌC CỦA GIÁO VIÊN",
        document1Id: document1Id,
        claasName: khoiLop,
        userId: user.userId,
        note: "",
        status: true,
        approveByName: "",
        isApprove: 1,
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
        await apiDeleteSubMenu3(documentId);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleAddDoc3 = async () => {
    const docId = document3Info?.id ?? documentId ;
    console.log(documentId);
    if (documentId) {
      if (location.pathname.includes("edit")) {
        await apiDeleteDocument3ForeignTableByDocument3ID(
          location.pathname.split("/")[3]
        );
        await apiPostNotification({
          receiveBy: [document1Info?.userId] || [],
          sentBy: user?.userId,
          titleName: `${document3Info?.name} ĐÃ ĐƯỢC CHỈNH SỬA, HÃY XÉT DUYỆT`,
          message: `${document3Info?.name} ĐÃ ĐƯỢC CHỈNH SỬA, HÃY XÉT DUYỆT`,
          docType: 3,
          docId: document3Info?.id,
        });
      }
      else {
        await apiPostNotification({
          receiveBy: [document1Info?.userId] || [],
          sentBy: user?.userId,
          titleName: `${document3Info?.name} ĐÃ ĐƯỢC ĐĂNG TẢI, HÃY XÉT DUYỆT`,
          message: `${document3Info?.name} ĐÃ ĐƯỢC ĐĂNG TẢI, HÃY XÉT DUYỆT`,
          docType: 3,
          docId: document3Info?.id,
        });
      }
      if (rows1 && rows2) {
        const rows1WithDocumentId = rows1.map((row) => ({
          ...row,
          document3Id: documentId ?? location.pathname.split('/')[3],
        }));
        const res1 = await apiPostSubMenu3CuriculumDistribution(
          rows1WithDocumentId
        );
        const rows2WithDocumentId = rows2.map((row) => ({
          ...row,
          document3Id: documentId ?? location.pathname.split('/')[3],
        }));
        const res2 = await apiPostSubMenu3SelectedTopics(rows2WithDocumentId);
        if (res1 && res2) {
          downloadPdf();
        }
      }
      setOpen(false);

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

  const handleClickOpenRemove = () => {
    setOpenRemove(true);
  };

  const handleCloseRemove = () => {
    setOpenRemove(false);
  };

  const handleAddRow1 = () => {
    const newRow = {
      stt: null,
      selectedTopicsId: null,
      curriculumId: null,
      equipmentId: [0],
      slot: null,
      time: "",
      subjectRoomId: "",
    };
    setRows1([...rows1, newRow]);
  };

  const handleAddRow2 = () => {
    const newRow = {
      stt: null,
      curriculumId: null,
      selectedTopicsId: null,
      equipmentId: [0],
      slot: null,
      time: "",
      subjectRoomId: "",
    };
    setRows2([...rows2, newRow]);
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
  const handleAddEquip = (rowIndex: number) => {
    const updatedRows = [...rows1];
    updatedRows[rowIndex].equipmentId.push(0);
    setRows1(updatedRows);
  };

  const handleRemoveEquip = (rowIndex: number, equipIndex: number) => {
    const updatedRows = [...rows1];
    updatedRows[rowIndex].equipmentId.splice(equipIndex, 1);
    setRows1(updatedRows);
  };

  const handleAddEquip2 = (rowIndex: number) => {
    const updatedRows = [...rows2];
    updatedRows[rowIndex].equipmentId.push(0);
    setRows2(updatedRows);
  };

  const handleRemoveEquip2 = (rowIndex: number, equipIndex: number) => {
    const updatedRows = [...rows2];
    updatedRows[rowIndex].equipmentId.splice(equipIndex, 1);
    setRows2(updatedRows);
  };
  const handleSubmitReport = async () => {
    const rp = {
      userId: parseInt(user?.userId),
      doctype: 3,
      docId: document3Info?.id,
      message: reasonReport,
      description: descriptionRp,
    };
    await apiPostReport(rp);
    setOpenReport(false);
  };
  return (
    <Grid
      display="flex"
      justifyContent="center"
      style={{ overflow: "visible" }}
    >
      <div
        className="sub-menu-container"
        style={{ minWidth: "25rem", width: "100rem" }}
      >
        {location.pathname?.includes("edit") ||
          location.pathname?.includes("create") ? (
          <div>
            <div
              className="sub-menu-content"
              id="main-content"
              style={{ border: "none", borderRadius: "0px" }}
            >
              <div className="sub-menu-content-header">
                <strong className="phu-luc">Phụ lục III</strong>
                <div className="sub-menu-content-header-title">
                  <strong className="sub-menu-content-header-title-main">
                    KHUNG KẾ HOẠCH DẠY HỌC MÔN HỌC CỦA GIÁO VIÊN
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
                    <div style={{ display: "flex" }}>
                      {" "}
                      <div>
                        <strong>TRƯỜNG: </strong>
                        <input
                          type="text"
                          placeholder="..........."
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex" }}>
                      {" "}
                      <div>
                        <strong>TỔ: </strong>
                        {specializedDepartment?.name}
                      </div>
                    </div>
                    <div style={{ display: "flex" }}>
                      {" "}
                      <div style={{ marginLeft: "4px" }}>
                        Họ và tên giáo viên:{giaoVien}
                      </div>
                    </div>
                  </div>
                  <div className="sub-menu-content-header-infomation-slogan">
                    <div>
                      {" "}
                      <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong>
                    </div>
                    <div>
                      {" "}
                      <strong>Độc lập - Tự do - Hạnh phúc</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sub-menu-content-title">
                <div>
                  <strong>KẾ HOẠCH DẠY HỌC CỦA GIÁO VIÊN</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div>
                    <strong>MÔN HỌC/HOẠT ĐỘNG GIÁO DỤC</strong>
                    <span
                      style={{
                        height: "25px",
                        marginLeft: "4px",
                        border: "none",
                        outline: "none",
                        fontSize: "inherit",
                        fontFamily: "Times New Roman,Times",
                        fontWeight: "bold",
                      }}
                    >
                      {document1Info?.subjectName.toUpperCase()}
                    </span>
                    <strong>, LỚP</strong>
                    <select
                      id="classes"
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
                      onChange={(e) => setKhoiLop(e.target.value)}
                      defaultValue={document3Info?.claasName ?? ""}
                    >
                      <option value="" disabled>
                        Chọn lớp
                      </option>
                      {classes?.map((item) => (
                        <option value={item?.name}>{item?.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>(Năm học 2023 - 2024)</div>
              </div>

              <div className="sub-menu-content-main">
                <div className="sub-menu-content-main-feature">
                  <div className="sub-menu-content-main-feature-item">
                    <div>
                      <strong>I. Phân phối chương trình</strong>
                    </div>
                  </div>
                  <div className="sub-menu-content-main-feature-table">
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
                              Bài học <br />
                              (1)
                            </TableCell>
                            <TableCell align="center">
                              Số tiết <br />
                              (2)
                            </TableCell>
                            <TableCell align="center">
                              Thời điểm <br />
                              (3)
                            </TableCell>
                            <TableCell align="center">
                              Thiết bị dạy học <br />
                              (4)
                            </TableCell>
                            <TableCell align="center">
                              Địa điểm dạy học
                              <br />
                              (5)
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows1?.map((row, index) => (
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
                                <TableCell align="center">
                                  <select
                                    id="curriculumDistribution"
                                    style={{
                                      width: "150px",
                                      height: "40px",
                                      marginLeft: "4px",
                                      border: "none",
                                      outline: "none",
                                    }}
                                    value={row?.curriculumId ?? ""}
                                    onChange={(e) => {
                                      const newValue = parseInt(e.target.value);
                                      const updatedRows = [...rows1];
                                      updatedRows[index].curriculumId =
                                        newValue;
                                      setRows1(updatedRows);
                                    }}
                                  >
                                    <option value="" disabled>
                                      Chọn bài học
                                    </option>
                                    {curriculumDistribution?.map((item) => (
                                      <option value={item?.curriculumId}>
                                        {item?.curriculumName}
                                      </option>
                                    ))}
                                  </select>
                                </TableCell>
                                <TableCell align="center">
                                  <textarea
                                    value={row.slot ?? ""}
                                    onChange={(e) => {
                                      const newValue = parseInt(e.target.value);
                                      const updatedRows = [...rows1];
                                      updatedRows[index].slot = newValue;
                                      setRows1(updatedRows);
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <input
                                    type="date"
                                    value={row.time ? formatDate(row.time) : ""}
                                    onChange={(e) => {
                                      const newValue = (e.target as HTMLInputElement).value;
                                      const updatedRows = [...rows1];
                                      updatedRows[index].time = newValue;
                                      setRows1(updatedRows);
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  {row.equipmentId?.map((equip, equipIndex) => (
                                    <div key={equipIndex}>
                                      <select
                                        id={"teachingEquipment"}
                                        style={{
                                          width: "150px",
                                          height: "40px",
                                          marginLeft: "4px",
                                          border: "none",
                                          outline: "none",
                                        }}
                                        value={equip ?? 0}
                                        onChange={(e) => {
                                          const newValue = parseInt(
                                            e.target.value
                                          );
                                          const updatedRows = [...rows1];
                                          updatedRows[index].equipmentId[
                                            equipIndex
                                          ] = newValue;
                                          setRows1(updatedRows);
                                        }}
                                      >
                                        <option value={0} disabled>
                                          Chọn thiết bị dạy học
                                        </option>
                                        {teachingEquipment?.map((item) => (
                                          <option
                                            value={item?.teachingEquipmentId}
                                          >
                                            {item?.teachingEquipmentName}
                                          </option>
                                        ))}
                                      </select>
                                      <div className="add-row-button">
                                        {equipIndex ===
                                          row.equipmentId.length - 1 && (
                                            <Add
                                              style={{
                                                color: "black",
                                                display: displayAddRow
                                                  ? "none"
                                                  : "",
                                              }}
                                              className="add-row-icon"
                                              onClick={() =>
                                                handleAddEquip(index)
                                              }
                                            />
                                          )}
                                        {row.equipmentId.length > 1 && (
                                          <Remove
                                            style={{
                                              color: "black",
                                              display: displayAddRow
                                                ? "none"
                                                : "",
                                            }}
                                            className="add-row-icon"
                                            onClick={() =>
                                              handleRemoveEquip(
                                                index,
                                                equipIndex
                                              )
                                            }
                                          />
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </TableCell>
                                <TableCell align="center">
                                  <select
                                    id="subjectRoom"
                                    style={{
                                      width: "150px",
                                      height: "40px",
                                      marginLeft: "4px",
                                      border: "none",
                                      outline: "none",
                                    }}
                                    value={row.subjectRoomId ?? ""}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      const updatedRows = [...rows1];
                                      updatedRows[index].subjectRoomId =
                                        newValue;
                                      setRows1(updatedRows);
                                    }}
                                  >
                                    <option value="" disabled>
                                      Chọn địa điểm
                                    </option>
                                    {subjectRoom?.map((item) => (
                                      <option value={item?.subjectRoomId}>
                                        {item?.subjectRoomName}
                                      </option>
                                    ))}
                                  </select>
                                </TableCell>
                              </TableRow>
                            </Tooltip>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <div className="add-row-button">
                      <Add
                        style={{
                          color: "black",
                          display: displayAddRow ? "none" : "",
                        }}
                        className="add-row-icon"
                        onClick={handleAddRow1}
                      />
                      <Remove
                        style={{
                          color: "black",
                          display: displayAddRow ? "none" : "",
                        }}
                        className="add-row-icon"
                        onClick={handleRemoveRow1}
                      />
                    </div>
                  </div>
                </div>

                <div className="sub-menu-content-main-feature">
                  <div className="sub-menu-content-main-feature-item">
                    <div>
                      <strong>2. Chuyên đề lựa chọn</strong>(đối với cấp trung
                      học phổ thông)
                    </div>
                  </div>
                  <div className="sub-menu-content-main-feature-table">
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
                              Bài học <br />
                              (1)
                            </TableCell>
                            <TableCell align="center">
                              Số tiết <br />
                              (2)
                            </TableCell>
                            <TableCell align="center">
                              Thời điểm <br />
                              (3)
                            </TableCell>
                            <TableCell align="center">
                              Thiết bị dạy học <br />
                              (4)
                            </TableCell>
                            <TableCell align="center">
                              Địa điểm dạy học
                              <br />
                              (5)
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows2?.map((row, index) => (
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
                                <TableCell align="center">
                                  <select
                                    id="curriculumDistribution"
                                    style={{
                                      width: "150px",
                                      height: "40px",
                                      marginLeft: "4px",
                                      border: "none",
                                      outline: "none",
                                    }}
                                    value={row?.selectedTopicsId ?? ""}
                                    onChange={(e) => {
                                      const newValue = parseInt(e.target.value);
                                      const updatedRows = [...rows2];
                                      updatedRows[index].selectedTopicsId =
                                        newValue;
                                      setRows2(updatedRows);
                                    }}
                                  >
                                    <option value="" disabled>
                                      Chọn bài học
                                    </option>
                                    {selectedTopics?.map((item) => (
                                      <option value={item?.selectedTopicsId}>
                                        {item?.selectedTopicsName}
                                      </option>
                                    ))}
                                  </select>
                                </TableCell>
                                <TableCell align="center">
                                  <textarea
                                    value={row.slot ?? ""}
                                    onChange={(e) => {
                                      const newValue = parseInt(e.target.value);
                                      const updatedRows = [...rows2];
                                      updatedRows[index].slot = newValue;
                                      setRows2(updatedRows);
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <input
                                    type="date"
                                    value={row.time ? formatDate(row.time) : ""}
                                    onChange={(e) => {
                                      const newValue = (e.target as HTMLInputElement).value;
                                      const updatedRows = [...rows2];
                                      updatedRows[index].time = newValue;
                                      setRows2(updatedRows);
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  {row.equipmentId?.map((equip, equipIndex) => (
                                    <div key={equipIndex}>
                                      <select
                                        id="teachingEquipment"
                                        style={{
                                          width: "150px",
                                          height: "40px",
                                          marginLeft: "4px",
                                          border: "none",
                                          outline: "none",
                                        }}
                                        value={equip ?? 0}
                                        onChange={(e) => {
                                          const newValue = parseInt(
                                            e.target.value
                                          );
                                          const updatedRows = [...rows2];
                                          updatedRows[index].equipmentId[
                                            equipIndex
                                          ] = newValue;
                                          setRows2(updatedRows);
                                        }}
                                      >
                                        <option value={0} disabled>
                                          Chọn thiết bị dạy học
                                        </option>
                                        {teachingEquipment?.map((item) => (
                                          <option
                                            value={item?.teachingEquipmentId}
                                          >
                                            {item?.teachingEquipmentName}
                                          </option>
                                        ))}
                                      </select>
                                      <div
                                        className="add-row-button"
                                        style={{
                                          display: displayAddRow ? "none" : "",
                                        }}
                                      >
                                        {equipIndex ===
                                          row.equipmentId.length - 1 && (
                                            <Add
                                              style={{ color: "black" }}
                                              className="add-row-icon"
                                              onClick={() =>
                                                handleAddEquip2(index)
                                              }
                                            />
                                          )}
                                        {row.equipmentId.length > 1 && (
                                          <Remove
                                            style={{ color: "black" }}
                                            className="add-row-icon"
                                            onClick={() =>
                                              handleRemoveEquip2(
                                                index,
                                                equipIndex
                                              )
                                            }
                                          />
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </TableCell>
                                <TableCell align="center">
                                  <select
                                    id="subjectRoom"
                                    style={{
                                      width: "150px",
                                      height: "40px",
                                      marginLeft: "4px",
                                      border: "none",
                                      outline: "none",
                                    }}
                                    value={row.subjectRoomId ?? ""}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      const updatedRows = [...rows2];
                                      updatedRows[index].subjectRoomId =
                                        newValue;
                                      setRows2(updatedRows);
                                    }}
                                  >
                                    <option value="" disabled>
                                      Chọn địa điểm
                                    </option>
                                    {subjectRoom?.map((item) => (
                                      <option value={item?.subjectRoomId}>
                                        {item?.subjectRoomName}
                                      </option>
                                    ))}
                                  </select>
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

                <div className="sub-menu-content-main-note">
                  <div>
                    <i>
                      (1) Tên bài học/chuyên đề được xây dựng từ nội dung/chủ đề
                      (được lấy nguyên hoặc thiết kê lại phù hợp với điều kiện
                      thực tê của nhà trường) theo chương trùnh, sách giáo khoa
                      môn họchoạt động giáo dục.{" "}
                    </i>
                  </div>
                  <div>
                    <i>
                      (2) Số tiết được sử dụng đề thực hiện bài dạy/chuyên đề.
                    </i>
                  </div>
                  <div>
                    <i>(3) Tuần thực hiện bài học/chuyên đề.</i>
                  </div>
                  <div>
                    <i>(4) Thiết bị dạy học được sử dụng để tổ chức dạy học.</i>
                  </div>
                  <div>
                    <i>
                      (5) Địa điểm tổ chức hoạt động dạy học (lớp học, phòng học
                      bộ môn, phòng đa năng, bãi tập, tại di sản, thực địa...).
                    </i>
                  </div>
                </div>

                <div className="sub-menu-content-main-feature">
                  <div className="sub-menu-content-main-feature-item">
                    <strong>II. Nhiệm vụ khác (nếu có)</strong>(Bồi dưỡng học
                    sinh giỏi; Tổ chức hoạt động giáo dục)
                  </div>
                  <div style={{ marginTop: "12px" }}>
                    <textarea
                      style={{ width: "100%", border: 0, lineHeight: "24px" }}
                      rows={5}
                      placeholder="................................................................................................................................................................................................................................................................................................................................................"
                      onChange={(e) => setNhiemVuKhac(e.target.value)}
                    />
                  </div>
                </div>
                <div className="sub-menu-content-main-signature">
                  <div className="to-truong">
                    <div>
                      <strong>TỔ TRƯỞNG</strong>
                    </div>
                    <div>
                      <i>(Ký và ghi rõ họ tên)</i>
                    </div>
                    <br /> <br />
                    <div>
                      <input
                        type="text"
                        placeholder="................................................................"
                        style={{ width: "150px" }}
                      />
                    </div>
                  </div>
                  <div className="hieu-truong">
                    <div>
                      <input
                        type="text"
                        placeholder="....................."
                        style={{ width: "60px" }}
                      />
                      , ngày{" "}
                      <input
                        type="number"
                        placeholder="....."
                        style={{ width: "30px" }}
                      />
                      , tháng{" "}
                      <input
                        type="number"
                        placeholder="....."
                        style={{ width: "30px" }}
                      />
                      , năm 20{" "}
                      <input
                        type="number"
                        placeholder="....."
                        style={{ width: "30px" }}
                      />
                    </div>
                    <div>
                      <strong>HIỆU TRƯỞNG</strong>
                    </div>
                    <div>
                      <i>(Ký và ghi rõ họ tên)</i>
                    </div>
                    <br /> <br />
                    <div>
                      <input
                        type="text"
                        placeholder="................................................................"
                        style={{ width: "150px" }}
                      />
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
              src={document3Info?.linkFile}
              width="100%"
              height="1000px"
              type="application/pdf"
            />
            <div>
              <div className="sub-menu-action">
                <div className="verify" style={{ justifyContent: "center" }}>
                  <div
                    style={{
                      display:
                        parseInt(user?.userId) === document3Info?.userId
                          ? "flex"
                          : "none",
                      columnGap: "10px",
                    }}
                  >
                    <div
                      className="action-button"
                      onClick={() =>
                        navigate(
                          `/sub-menu-3/detail-edit/${location.pathname.split("/")[3]
                          }`
                        )
                      }
                    >
                      Sửa
                    </div>
                    <div
                      className="action-button"
                      onClick={handleClickOpenRemove}
                    >
                      Xóa
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sub-menu-infomation">
              <div className="sub-menu-row">
                <div>
                  <i>
                    {document3Info?.isApprove === 3
                      ? "(Tài liệu đã được thẩm định)"
                      : "(Tài liệu chưa được thẩm định)"}
                  </i>
                </div>
              </div>
              <div className="sub-menu-row">
                <div>
                  <strong>Người gửi: </strong>{" "}
                  <u className="underline-blue">
                    {document3Info?.userFullName}
                  </u>
                </div>
                <div className="right-action" onClick={() => navigate(`/sub-menu-4/list-view/${document3Info?.id}`)}>
                  <strong>
                    <u className="underline-blue">
                      Xem các kế hoạch bài dạy
                    </u>
                  </strong>
                </div>
              </div>
              <div className="sub-menu-row">
                <div>
                  <strong>Nguồn: </strong> https://baigiang.violet.vn
                </div>
                <div className="right-action" onClick={handleClickOpenReport}>
                  <strong>
                    <u className="underline-blue">
                      Báo cáo tài liệu có sai sót
                    </u>
                  </strong>
                </div>
              </div>
              <div className="sub-menu-row">
                <div>
                  <strong>Ngày gửi: </strong> {document3Info?.createdDate}
                </div>
                <div
                  style={{
                    display:
                      userInfoLogin?.id === document3Info?.userId && document3Info?.isApprove === 3
                        ? "flex"
                        : "none",
                  }}
                  className="right-action" onClick={() => navigate(`/upload-sub-menu-4/${document3Info?.id}`)}>
                  <strong>
                    <u className="underline-blue">
                      Tạo kế hoạch bài dạy
                    </u>
                  </strong>
                </div>
              </div>
            </div>
            <div>
              <div className="sub-menu-action">
                <div
                  className="verify"
                  style={{
                    display:
                      user?.role === "Leader" && document3Info?.isApprove === 2 && userInfoLogin?.departmentId === userInfoDocument?.departmentId
                        ? "flex"
                        : "none",
                  }}
                >
                  <span>Tình trạng thẩm định:</span>
                  {
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
                  }
                </div>
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
            <Button onClick={handleAddDoc3} className="button-mui" autoFocus>
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
            <Button
              onClick={handleSubmitReport}
              className="button-mui"
              autoFocus
            >
              Gửi báo cáo
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openAccept}
          onClose={handleCloseAccept}
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
                  await apiUpdateSubMenu3(
                    {
                      id: document3Info?.id,
                      document1Id: document3Info?.document1Id,
                      userId: document3Info?.userId,
                      isApprove: 3,
                      approveBy: user?.userId,
                    },
                    document3Info?.id
                  );
                  await apiPostNotification({
                    receiveBy: [document3Info?.userId] || [],
                    sentBy: user?.userId,
                    titleName: `${document3Info?.name} ĐÃ ĐƯỢC CHẤP NHẬN`,
                    message: `${document3Info?.name} ĐÃ ĐƯỢC CHẤP NHẬN`,
                    docType: 3,
                    docId: document3Info?.id,
                  });
                  alert("Thành công! Hãy chờ đợi trong giây lát để chuyển trang");
                  navigate(`/sub-menu/3`);
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
          onClose={handleCloseDeny}
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
                  await apiUpdateSubMenu3(
                    {
                      id: document3Info?.id,
                      document1Id: document3Info?.document1Id,
                      userId: document3Info?.userId,
                      isApprove: 4,
                      approveBy: user?.userId,
                    },
                    document3Info?.id
                  );
                  await apiPostNotification({
                    receiveBy: [document3Info?.userId] || [],
                    sentBy: user?.userId,
                    titleName: `${document3Info?.name} ĐÃ BỊ TỪ CHỐI, HÃY ĐĂNG TẢI LẠI`,
                    message: `${document3Info?.name} ĐÃ BỊ TỪ CHỐI, HÃY ĐĂNG TẢI LẠI`,
                    docType: 3,
                    docId: document3Info?.id,
                  });
                  alert("Thành công! Hãy chờ đợi trong giây lát để chuyển trang");
                  navigate(`/sub-menu/3`);
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
          onClose={handleCloseRemove}
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
            <Button
              onClick={async () => {
                await apiDeleteSubMenu3(location.pathname.split("/")[3]);
                navigate("/sub-menu/3");
              }}
              className="button-mui"
              autoFocus
            >
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Grid>
  );
};

export default SubMenu3Detail;
