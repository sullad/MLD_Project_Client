import React, { useCallback, useEffect, useState } from "react";
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
} from "@mui/material";
import "./style.scss";
import { Add, Remove } from "@mui/icons-material";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useLocation, useNavigate } from "react-router-dom";
import { apiGetSelectedTopic } from "../../api/selectedTopic";
import { SelectedTopic } from "../../models/SelectedTopic";
import { User } from "../../models/User";
import { apiGetAllGetUser, apiGetUser } from "../../api/user";
import { apiGetUserHostBy } from "../../api/subMenu2";
import { Grade } from "../../models/grade";
import { apiGetGrade } from "../../api/grade";
import { useAppSelector } from "../../hook/useTypedSelector";
import {
  apiDeleteDocument2GradeByDocument2Id,
  apiDeleteSubMenu2,
  apiGetDocument2GradeById,
  apiGetSubMenu2ById,
  apiPostSubMenu2,
  apiPostSubMenu2Grade,
  apiUpdateSubMenu2,
} from "../../api/subMenu2";
import { formatDate } from "../../utils/date";
import { Department } from "../../models/department";
import { apiGetSpecializedDepartmentById } from "../../api/specializedDepartment";
import { FormCategory } from "../../models/formCategory";
import { Document1 } from "../../models/document1";
import { options } from "../UploadPhuLuc4";
import generatePDF from "react-to-pdf";
import axios from "axios";
import { TotalClass } from "../../models/totalClass";
import { apiGetTotalClassByGradeId } from "../../api/subMenu1";
import { apiPostReport } from "../../api/report";
import {
  apiGetListHostbyByIdOfUserByDoc2Id,
  apiGetListIdOfTeacherAndPricipleByDepartmentId,
  apiPostNotification,
} from "../../api/notification";

interface Row {
  gradeId: number | null;
  titleName: string;
  description: string;
  slot: number | null;
  time: string;
  place: string;
  hostBy: number[];
  collaborateWith: string;
  condition: string;
}

interface GradeRow {
  gradeId: number | null;
}

const SubMenu2Detail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [multiRows, setMultiRows] = useState<Row[][]>([
    [
      {
        gradeId: null,
        titleName: "",
        description: "",
        slot: null,
        time: "",
        place: "",
        hostBy: [0],
        collaborateWith: "",
        condition: "",
      },
    ],
  ]);
  const [gradeIds, setGradeIds] = useState<GradeRow[]>([{ gradeId: null }]);
  const [open, setOpen] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openDeny, setOpenDeny] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [specializedDepartment, setSpecializedDepartment] =
    useState<Department>();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [documentId, setDocumentId] = useState(null);
  const [userInfoLogin, setUserInfoLogin] = useState<User>();
  const [userInfoDocument, setUserInfoDocument] = useState<User>();
  const [document2Info, setDocument2Info] = useState<Document1>();
  const [totalClass, setTotalClass] = useState<TotalClass>();
  const [multiTotalClass, setMultiTotalClass] = useState<TotalClass[]>([]);
  const [displayAddRow, setDisplayAddRow] = useState(false);
  const [reasonReport, setReasonReport] = useState("");
  const [descriptionRp, setDescriptionRp] = useState("");
  const [principleAndTeacher, setPrincipleAndTeacher] = useState<any>();
  const [hostByList, setHostByList] = useState<any>();
  const [principle, setPrinciple] = useState<any>();

  const [truong, setTruong] = useState("");
  const [toTruong, setToTruong] = useState("");
  const [hieuTruong, setHieuTruong] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const getTargetElement = () => document.getElementById("main-content");

  const downloadPdf = async () => {
    try {
      const pdf = await generatePDF(getTargetElement, options);
      const formData = new FormData();
      formData.append("files", pdf.output("blob"), "document.pdf");

      const response = await axios.post(
        "https://localhost:7241/api/S3FileUpload/upload?prefix=doc2%2F",
        formData
      );
      if (response?.status === 200) {
        const res = await apiUpdateSubMenu2(
          { id: documentId, linkFile: response?.data, userId: user?.userId },
          documentId
        );
        if (res && documentId) {
          setDisplayAddRow(!displayAddRow);
          alert("Thành công! Hãy chờ đợi trong giây lát để chuyển trang");
          navigate(`/sub-menu-2/detail-view/${documentId}`);
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
    const fecthPrincipleByDoc = async () => {
      if (document2Info) {
        const res = await apiGetUser(document2Info?.approveBy)
        if (res && res.data) {
          const principleData: any = res.data;
          setPrinciple(principleData);
        }
      }
    }
    fecthPrincipleByDoc()
  }, [document2Info])

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
    fecthPrincipleAndTeacher();
  }, [specializedDepartment?.id]);
  useEffect(() => {
    const fecthHostByList = async () => {
      if (document2Info) {
        const res = await apiGetListHostbyByIdOfUserByDoc2Id(document2Info?.id);
        if (res && res.data) {
          const resData: any = res.data;
          setHostByList(resData);
        }
      }
    };
    fecthHostByList();
  }, [document2Info]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fecthTotalClass = useCallback(
    async (gradeId: any, index: any) => {
      const res = await apiGetTotalClassByGradeId(gradeId);
      if (res && res.data) {
        const totalClassData: TotalClass = res.data;
        setTotalClass(totalClassData);
        const updatedMultiTotalClass = [...multiTotalClass];
        updatedMultiTotalClass[index] = res.data;
        setMultiTotalClass(updatedMultiTotalClass);
      }
    },
    [multiTotalClass]
  );

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      const fetchDoc2GradeInfo = async () => {
        const res = await apiGetDocument2GradeById(
          location.pathname.split("/")[3]
        );
        if (res && res.data) {
          const gradeMap = new Map();

          res.data.forEach((item: any, index: any) => {
            if (gradeMap.has(item.gradeId)) {
              const existingArray = gradeMap.get(item.gradeId);
              existingArray.push(item);
              gradeMap.set(item.gradeId, existingArray);
            } else {
              gradeMap.set(item.gradeId, [item]);
            }
            fecthTotalClass(item.gradeId, index);
          });

          const formatRes = Array.from(gradeMap.values());
          setMultiRows(formatRes);
        }
        if (res?.data.length === 0) {
          setMultiRows([
            [
              {
                gradeId: null,
                titleName: "",
                description: "",
                slot: null,
                time: "",
                place: "",
                hostBy: [0],
                collaborateWith: "",
                condition: "",
              },
            ],
          ]);
        }
      };
      fetchDoc2GradeInfo();
    }
  }, [location.pathname]);

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
        const fecthDoc2 = await apiGetSubMenu2ById(
          location.pathname.split("/")[3]
        );
        if (fecthDoc2 && fecthDoc2.data) {
          const doc2Data: any = fecthDoc2.data;
          setDocument2Info(doc2Data);
          const fecthUserResult = await apiGetUser(doc2Data?.userId);
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
    fetchSpecializedDepartmentById();
  }, [location.pathname, userInfoLogin]);

  useEffect(() => {
    const fetchGrades = async () => {
      const res = await apiGetGrade();
      if (res && res.data) {
        const gradeData: Grade[] = res.data;
        setGrades(gradeData);
      }
    };

    fetchGrades();
  }, []);

  useEffect(() => {
    const fetchAllUser = async () => {
      if (userInfoLogin) {
        const res = await apiGetUserHostBy(userInfoLogin?.departmentId);
        if (res && res.data) {
          const usersData: User[] = res.data;
          setUsers(usersData);
        }
      }
    };
    fetchAllUser();
  }, [userInfoLogin]);

  const handleClickOpen = async () => {
    setDisplayAddRow(!displayAddRow);
    if (location.pathname.includes("create")) {
      const today = new Date();
      const createdDate = `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
      if (user) {
        setOpen(true);
        try {
          const post = await apiPostSubMenu2([
            {
              name: "KẾ HOẠCH TỔ CHỨC CÁC HOẠT ĐỘNG GIÁO DỤC CỦA TỔ CHUYÊN MÔN",
              userId: user.userId,
              userName: user.username,
              createdDate: createdDate,
              status: true,
              approveByName: "",
              isApprove: 1,
            },
          ]);
          if (post) {
            setDocumentId(post?.data[0]?.id);
            await apiPostNotification({
              receiveBy: principleAndTeacher?.principle || [],
              sentBy: user?.userId,
              titleName: `${post?.data[0].name} ĐÃ ĐƯỢC ĐĂNG TẢI, HÃY XÉT DUYỆT`,
              message: `${post?.data[0].name} ĐÃ ĐƯỢC ĐĂNG TẢI, HÃY XÉT DUYỆT`,
              docType: 2,
              docId: post?.data?.id,
            });
          }
        } catch (error) {
          alert("Something went wrong");
        }
      } else alert("Something went wrong!");
    } else {
      if (user) {
        setOpen(true);
        await apiPostNotification({
          receiveBy: principleAndTeacher?.principle || [],
          sentBy: user?.userId,
          titleName: `${document2Info?.name} ĐÃ ĐƯỢC CHỈNH SỬA, HÃY XÉT DUYỆT`,
          message: `${document2Info?.name} ĐÃ ĐƯỢC CHỈNH SỬA, HÃY XÉT DUYỆT`,
          docType: 2,
          docId: document2Info?.id,
        });
      }
    }
  };

  const handleClickOpen1 = async () => {
    setDisplayAddRow(!displayAddRow);
    const today = new Date();
    const createdDate = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    if (user) {
      setOpen(true);
      try {
        const post = await apiPostSubMenu2([
          {
            name: "KẾ HOẠCH TỔ CHỨC CÁC HOẠT ĐỘNG GIÁO DỤC CỦA TỔ CHUYÊN MÔN",
            userId: user.userId,
            userName: user.username,
            createdDate: createdDate,
            status: true,
            approveByName: "",
            isApprove: 2,
          },
        ]);
        if (post) {
          setDocumentId(post?.data[0]?.id);
        }
      } catch (error) {
        alert("Something went wrong");
      }
    } else alert("Something went wrong!");
  };

  const handleClose = async () => {
    if (location.pathname.includes("create")) {
      setDisplayAddRow(!displayAddRow);
      setOpen(false);
      try {
        await apiDeleteSubMenu2(documentId);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleClickOpenAccept = () => {
    setOpenAccept(true);
  };

  const handleAccept = () => {
    setOpenAccept(false);
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
      doctype: 2,
      docId: document2Info?.id,
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
    navigate(`/sub-menu-2/detail-edit/${location.pathname.split("/")[3]}`);
  };

  const handleClickAdd = () => {
    navigate(`/sub-menu-2/detail-create`);
  };

  const handleAddRow = (index: number) => {
    const newRow = {
      gradeId: null,
      titleName: "",
      description: "",
      slot: null,
      time: "",
      place: "",
      hostBy: [0],
      collaborateWith: "",
      condition: "",
    };
    const updatedSubRows = [...multiRows[index], newRow];
    const updatedMultiRows = [...multiRows];
    updatedMultiRows[index] = updatedSubRows;
    setMultiRows(updatedMultiRows);
  };

  const handleRemoveRow = (index: number) => {
    if (multiRows[index].length > 1) {
      const updatedSubRows = [...multiRows[index]];
      updatedSubRows.pop();
      const updatedMultiRows = [...multiRows];
      updatedMultiRows[index] = updatedSubRows;
      setMultiRows(updatedMultiRows);
    }
  };

  const handleAddGrade = (indexGrade: number) => {
    const newSubRow = [
      {
        gradeId: indexGrade,
        titleName: "",
        description: "",
        slot: null,
        time: "",
        place: "",
        hostBy: [0],
        collaborateWith: "",
        condition: "",
      },
    ];
    setMultiRows([...multiRows, newSubRow]);
    const newGradeId = { gradeId: indexGrade };
    setGradeIds([...gradeIds, newGradeId]);
  };

  const handleAddDoc2 = async () => {
    if (location.pathname.includes("edit"))
      await apiDeleteDocument2GradeByDocument2Id(
        location.pathname.split("/")[3]
      );
    const formatMultiRow = multiRows?.map((rows, index) => {
      rows?.forEach((row) => {
        row.gradeId = gradeIds[index]?.gradeId ?? null;
      });
      return rows;
    });
    const flattenedRows = formatMultiRow.reduce((accumulator, currentValue) => {
      accumulator.push(...currentValue);
      return accumulator;
    }, []);
    const rowsWithDocumentId = flattenedRows.map((row) => {
      return { ...row, document2Id: documentId };
    });

    if (rowsWithDocumentId) {
      try {
        const res = await apiPostSubMenu2Grade(rowsWithDocumentId);
        if (res) {
          alert("Thành công! Xin hãy đợi trong giây lát");
          downloadPdf();
        }
      } catch (error) {
        alert("Đã xảy ra lỗi");
      }
    }
    setOpen(false);
  };

  const handleAddHost = (rowIndex: number, rowIndex2: number) => {
    const updatedRows = [...multiRows];
    updatedRows[rowIndex][rowIndex2].hostBy.push(0);
    setMultiRows(updatedRows);
  };
  const handleRemoveHost = (
    rowIndex: number,
    rowIndex2: number,
    equipIndex: number
  ) => {
    const updatedRows = [...multiRows];
    updatedRows[rowIndex][rowIndex2].hostBy.splice(equipIndex, 1);
    setMultiRows(updatedRows);
  };
  return (
    <div className="sub-menu-container" style={{ minWidth: "30rem" }}>
      {location.pathname?.includes("edit") ||
        location.pathname?.includes("create") ? (
        <div>
          <div className="sub-menu-content" id="main-content">
            <div className="sub-menu-content-header">
              <strong className="phu-luc">Phụ lục II</strong>
              <div className="sub-menu-content-header-title">
                <strong className="sub-menu-content-header-title-main">
                  KHUNG KẾ HOẠCH TỔ CHỨC CÁC HOẠT ĐỘNG GIÁO DỤC CỦA TỔ CHUYÊN
                  MÔN
                </strong>
                <div className="sub-menu-content-header-title-sub">
                  <i>
                    (Kèm theo Công văn số 5512/BGDĐT-GDTrH ngày 18 tháng 12 năm
                    2020 của Bộ GDĐT)
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
                        onChange={(e) => setTruong(e.target.value)}
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
                <strong>
                  KẾ HOẠCH TỔ CHỨC CÁC HOẠT ĐỘNG GIÁO DỤC CỦA TỔ CHUYÊN MÔN
                </strong>
              </div>
              <div>(Năm học 2023 - 2024)</div>
            </div>

            <div className="sub-menu-content-main">
              {multiRows.map((subRows, indexGrade) => (
                <Tooltip
                  key={indexGrade}
                  disableFocusListener
                  placement="left"
                  title={
                    <h2
                      onClick={() => handleAddGrade(indexGrade)}
                      style={{ cursor: "pointer" }}
                    >
                      Add
                    </h2>
                  }
                >
                  <div className="sub-menu-content-main-feature">
                    <div
                      className="sub-menu-content-main-feature-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: "6px",
                      }}
                    >
                      <div>
                        <strong>{indexGrade + 1}. Khối lớp: </strong>
                        <select
                          id="grade"
                          style={{
                            width: "40px",
                            height: "20px",
                            marginLeft: "4px",
                            border: "none",
                            outline: "none",
                          }}
                          value={gradeIds[indexGrade]?.gradeId ?? ""}
                          defaultValue={subRows[0]?.gradeId ?? ""}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value);
                            const updatedGradeIds = [...gradeIds];
                            if (indexGrade >= 0) {
                              updatedGradeIds[indexGrade].gradeId = newValue;
                              setGradeIds(updatedGradeIds);
                            }
                            fecthTotalClass(
                              parseInt(e.target.value),
                              indexGrade
                            );
                          }}
                        >
                          <option value="" disabled>
                            Chọn khối lớp
                          </option>
                          {grades?.map((item) => (
                            <option value={item?.id}>{item?.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <strong>Số học sinh: </strong>
                        {multiTotalClass[indexGrade]?.totalStudent}
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
                                Chủ đề <br />
                                (1)
                              </TableCell>
                              <TableCell align="center">
                                Yêu cầu cần đạt <br />
                                (2)
                              </TableCell>
                              <TableCell align="center">
                                Số tiết <br />
                                (3)
                              </TableCell>
                              <TableCell align="center">
                                Thời điểm <br />
                                (4)
                              </TableCell>
                              <TableCell align="center">
                                Địa điểm <br />
                                (5)
                              </TableCell>
                              <TableCell align="center">
                                Chủ trì <br />
                                (6)
                              </TableCell>
                              <TableCell align="center">
                                Phối hợp <br />
                                (7)
                              </TableCell>
                              <TableCell align="center">
                                Điều kiện thực hiên <br />
                                (8)
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {subRows.map((row, index) => (
                              <Tooltip
                                key={index}
                                disableFocusListener
                                placement="right"
                                title={
                                  <h2
                                    onClick={() => {
                                      const updatedRows = [...subRows];
                                      updatedRows.splice(index, 1);
                                      setMultiRows((prevRows) => {
                                        const updatedRows = [...subRows];
                                        updatedRows.splice(index, 1);
                                        const newMultiRows = [...prevRows]; // Tạo một bản sao của mảng multiRows
                                        newMultiRows[indexGrade] = updatedRows; // Cập nhật phần của mảng cần thay đổi
                                        return newMultiRows; // Trả về mảng mới đã được cập nhật
                                      });
                                    }}
                                    style={{ cursor: "pointer" }}
                                  >
                                    Xóa hàng
                                  </h2>
                                }
                              >
                                <TableRow
                                  key={index}
                                  sx={{ td: { border: 1 } }}
                                >
                                  <TableCell align="center">
                                    {index + 1}
                                  </TableCell>
                                  <TableCell align="center">
                                    <textarea
                                      value={row.titleName ?? null}
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        const updatedRows = [...multiRows];
                                        updatedRows[indexGrade][
                                          index
                                        ].titleName = newValue;
                                        setMultiRows(updatedRows);
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <textarea
                                      value={row.description ?? null}
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        const updatedRows = [...multiRows];
                                        updatedRows[indexGrade][
                                          index
                                        ].description = newValue;
                                        setMultiRows(updatedRows);
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <textarea
                                      value={row.slot ?? ""}
                                      onChange={(e) => {
                                        const newValue = parseInt(
                                          e.target.value
                                        );
                                        const updatedRows = [...multiRows];
                                        updatedRows[indexGrade][index].slot =
                                          newValue;
                                        setMultiRows(updatedRows);
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <input
                                      type="date"
                                      value={
                                        row.time ? formatDate(row.time) : ""
                                      }
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        const updatedRows = [...multiRows];
                                        updatedRows[indexGrade][index].time =
                                          newValue;
                                        setMultiRows(updatedRows);
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <textarea
                                      value={row.place ?? null}
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        const updatedRows = [...multiRows];
                                        updatedRows[indexGrade][index].place =
                                          newValue;
                                        setMultiRows(updatedRows);
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    {row.hostBy?.map((hos, hosIndex) => (
                                      <div key={hosIndex}>
                                        <select
                                          id="selectedTopic"
                                          style={{
                                            width: "150px",
                                            height: "40px",
                                            marginLeft: "4px",
                                            border: "none",
                                            outline: "none",
                                          }}
                                          value={hos ?? 0}
                                          onChange={(e) => {
                                            const newValue = parseInt(
                                              e.target.value
                                            );
                                            const updatedRows = [...multiRows];
                                            updatedRows[indexGrade][
                                              index
                                            ].hostBy[hosIndex] = newValue;
                                            setMultiRows(updatedRows);
                                          }}
                                        >
                                          <option value={0} disabled>
                                            Chọn chủ trì
                                          </option>
                                          {users?.map((item) => (
                                            <option value={item?.id}>
                                              {item?.name}
                                            </option>
                                          ))}
                                        </select>
                                        <div className="add-row-button">
                                          {hosIndex ===
                                            row.hostBy.length - 1 && (
                                              <Add
                                                style={{
                                                  color: "black",
                                                  display: displayAddRow
                                                    ? "none"
                                                    : "",
                                                }}
                                                className="add-row-icon"
                                                onClick={() =>
                                                  handleAddHost(indexGrade, index)
                                                }
                                              />
                                            )}
                                          {row.hostBy.length > 1 && (
                                            <Remove
                                              style={{
                                                color: "black",
                                                display: displayAddRow
                                                  ? "none"
                                                  : "",
                                              }}
                                              className="add-row-icon"
                                              onClick={() =>
                                                handleRemoveHost(
                                                  indexGrade,
                                                  index,
                                                  hosIndex
                                                )
                                              }
                                            />
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </TableCell>
                                  <TableCell align="center">
                                    <textarea
                                      value={row.collaborateWith ?? null}
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        const updatedRows = [...multiRows];
                                        updatedRows[indexGrade][
                                          index
                                        ].collaborateWith = newValue;
                                        setMultiRows(updatedRows);
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <textarea
                                      value={row.condition ?? null}
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        const updatedRows = [...multiRows];
                                        updatedRows[indexGrade][
                                          index
                                        ].condition = newValue;
                                        setMultiRows(updatedRows);
                                      }}
                                    />
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
                          onClick={() => handleAddRow(indexGrade)}
                        />
                        <Remove
                          style={{
                            color: "black",
                            display: displayAddRow ? "none" : "",
                          }}
                          className="add-row-icon"
                          onClick={() => handleRemoveRow(indexGrade)}
                        />
                      </div>
                    </div>
                  </div>
                </Tooltip>
              ))}

              <div className="sub-menu-content-main-note">
                <div>
                  <i>
                    (1) Tên chủ đề tham quan, cắm trại, sinh hoạt tập thể, câu
                    lạc bộ, hoạt động phục vụ cộng đồng.
                  </i>
                </div>
                <div>
                  <i>
                    (2) Yêu cầu (mức độ) cần đạt của hoạt động giáo dục đối với
                    các đối tượng tham gia.
                  </i>
                </div>
                <div>
                  <i>(3) Số tiết được sử dụng để thực hiện hoạt động.</i>
                </div>
                <div>
                  <i>(4) Thời điểm thực hiện hoạt động (tuần/tháng/năm).</i>
                </div>
                <div>
                  <i>
                    (5) Địa điểm tổ chức hoạt động (phòng thí nghiệm, thực hành,
                    phòng đa năng, sân chơi, bãi tập, cơ sở sản xuất, kinh
                    doanh, tại di sản, tại thực địa...).
                  </i>
                </div>
                <div>
                  <i>(6) Đơn vị, cá nhân chủ trì tổ chức hoạt động.</i>
                </div>
                <div>
                  <i>(7) Đơn vị, cá nhân phối hợp tổ chức hoạt động.</i>
                </div>
                <div>
                  <i>(8) Cơ sở vật chất, thiết bị giáo dục, học liệu…</i>
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
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {/* <input
                      type="text"
                      placeholder="................................................................"
                      style={{ width: "150px" }}
                      onChange={(e) => setToTruong(e.target.value)}
                    /> */}
                    <img src={userInfoLogin?.signature} alt="" style={{ width: "150px", height: "auto" }} />
                    <p>
                      {
                        location.pathname.includes("create") ? userInfoLogin?.firstName + " " + userInfoLogin?.lastName : userInfoDocument?.fullName
                      }
                    </p>
                  </div>
                </div>
                <div className="hieu-truong">
                  <div>
                    <input
                      type="text"
                      placeholder="....................."
                      style={{ width: "60px" }}
                      onChange={(e) => setDayOfWeek(e.target.value)}
                    />
                    , ngày{" "}
                    <input
                      type="number"
                      placeholder="....."
                      style={{ width: "30px" }}
                      onChange={(e) => setDayOfMonth(e.target.value)}
                    />
                    , tháng{" "}
                    <input
                      type="number"
                      placeholder="....."
                      style={{ width: "30px" }}
                      onChange={(e) => setMonth(e.target.value)}
                    />
                    , năm 20{" "}
                    <input
                      type="number"
                      placeholder="....."
                      style={{ width: "30px" }}
                      onChange={(e) => setYear(e.target.value)}
                    />
                  </div>
                  <div>
                    <strong>HIỆU TRƯỞNG</strong>
                  </div>
                  <div>
                    <i>(Ký và ghi rõ họ tên)</i>
                  </div>
                  <br />
                  <br />
                  {
                    document2Info?.approveBy !== null ? <input
                      type="text"
                      placeholder="................................................................"
                      style={{ width: "150px" }}
                      onChange={(e) => setToTruong(e.target.value)}
                    /> :
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <img src={principle?.signature} alt="" style={{ width: "150px", height: "auto" }} />
                        <p>
                          {
                            document2Info?.approveBy ?? principle?.firstName + " " + principle?.lastName
                          }
                        </p>
                      </div>
                  }
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
            src={document2Info?.linkFile}
            width="100%"
            height="1000px"
            type="application/pdf"
          />
          <div>
            <div className="sub-menu-action">
              <div className="verify" style={{ justifyContent: "center" }}>
                <div style={{ display: "flex", columnGap: "10px" }}>
                  <div
                    style={{
                      display:
                        userInfoLogin?.id === userInfoDocument?.id
                          ? "initial"
                          : "none",
                    }}
                    className="action-button"
                    onClick={
                      location.pathname.includes("create")
                        ? handleClickAdd
                        : handleClickSave
                    }
                  >
                    {location.pathname.includes("create") ? "Tạo mới" : "Sửa"}
                  </div>
                  <div
                    style={{
                      display:
                        userInfoLogin?.id === userInfoDocument?.id
                          ? "initial"
                          : "none",
                    }}
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
                  {document2Info?.isApprove === 3
                    ? "(Tài liệu đã được thẩm định)"
                    : "(Tài liệu chưa được thẩm định)"}
                </i>
              </div>
            </div>
            <div className="sub-menu-row">
              <div>
                <strong>Người gửi: </strong>{" "}
                <u className="underline-blue">{document2Info?.userFullName}</u>
              </div>
            </div>
            <div className="sub-menu-row">
              <div>
                <strong>Nguồn: </strong> https://baigiang.violet.vn
              </div>
              <div className="right-action" onClick={handleClickOpenReport}>
                <strong>
                  <u className="underline-blue">Báo cáo tài liệu có sai sót</u>
                </strong>
              </div>
            </div>
            <div className="sub-menu-row">
              <div>
                <strong>Ngày gửi: </strong> {document2Info?.createdDate}
              </div>
            </div>
          </div>
          <div>
            <div className="sub-menu-action">
              <div
                className="verify"
                style={{
                  display:
                    user?.role === "Principle" && document2Info?.isApprove === 2
                      ? "flex"
                      : "none",
                }}
              >
                <span>Tình trạng thẩm định:</span>
                {
                  user?.role === "principle" && <div style={{ display: "flex", columnGap: "10px" }}>
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
          <Button onClick={handleAddDoc2} className="button-mui" autoFocus>
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
                await apiUpdateSubMenu2(
                  {
                    id: document2Info?.id,
                    userId: document2Info?.userId,
                    isApprove: 3,
                    approveBy: user?.userId,
                  },
                  document2Info?.id
                );
                await apiPostNotification({
                  receiveBy: [document2Info?.userId] || [],
                  sentBy: user?.userId,
                  titleName: `${document2Info?.name} ĐÃ ĐƯỢC CHẤP NHẬN`,
                  message: `${document2Info?.name} ĐÃ ĐƯỢC CHẤP NHẬN`,
                  docType: 2,
                  docId: document2Info?.id,
                });
                await apiPostNotification({
                  receiveBy: hostByList || [],
                  sentBy: user?.userId,
                  titleName: `${document2Info?.name} ĐÃ ĐƯỢC CHẤP NHẬN, HÃY TẠO KHUNG KẾ HOẠCH`,
                  message: `${document2Info?.name} ĐÃ ĐƯỢC CHẤP NHẬN, HÃY TẠO KHUNG KẾ HOẠCH`,
                  docType: 2,
                  docId: document2Info?.id,
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
                await apiUpdateSubMenu2(
                  {
                    id: document2Info?.id,
                    userId: document2Info?.userId,
                    isApprove: 4,
                    approveBy: user?.userId,
                  },
                  document2Info?.id
                );
                await apiPostNotification({
                  receiveBy: [document2Info?.userId] || [],
                  sentBy: user?.userId,
                  titleName: `${document2Info?.name} ĐÃ BỊ TỪ CHỐI HÃY ĐĂNG TẢI LẠI`,
                  message: `${document2Info?.name} ĐÃ BỊ TỪ CHỐI HÃY ĐĂNG TẢI LẠI`,
                  docType: 2,
                  docId: document2Info?.id,
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
              await apiDeleteSubMenu2(location.pathname.split("/")[3]);
              navigate("/sub-menu/2");
            }}
            className="button-mui"
            autoFocus
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SubMenu2Detail;
