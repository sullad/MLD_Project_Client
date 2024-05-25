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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { apiGetSubMenu4ById, apiGetSubMenu4infoById } from "../../api/subMenu4";
import { useAppSelector } from "../../hook/useTypedSelector";
import {
  apiGetSubMenu5ByDoc4Id,
  apiGetSubMenu5ById,
  apiPostSubMenu5,
  apiUpdateSubMenu5,
} from "../../api/subMenu5";
import generatePDF from "react-to-pdf";
import { options } from "../UploadPhuLuc4";
import axios from "axios";
import { apiPostEvaluate } from "../../api/evaluate";

import { apiGetUser } from "../../api/user";
import { User } from "../../models/User";

const SubMenu5Detail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tiet, setTiet] = useState<number | null>(null);
  const [tieuChi1, setTieuChi1] = useState<number | null>(null);
  const [tieuChi2, setTieuChi2] = useState<number | null>(null);
  const [tieuChi3, setTieuChi3] = useState<number | null>(null);
  const [tieuChi4, setTieuChi4] = useState<number | null>(null);
  const [tieuChi5, setTieuChi5] = useState<number | null>(null);
  const [tieuChi6, setTieuChi6] = useState<number | null>(null);
  const [tieuChi7, setTieuChi7] = useState<number | null>(null);
  const [tieuChi8, setTieuChi8] = useState<number | null>(null);
  const [tieuChi9, setTieuChi9] = useState<number | null>(null);
  const [tieuChi10, setTieuChi10] = useState<number | null>(null);
  const [tieuChi11, setTieuChi11] = useState<number | null>(null);
  const [tieuChi12, setTieuChi12] = useState<number | null>(null);
  const [tongDiem, setTongDiem] = useState<number | null>(null);
  const [nguoiDanhGia, setNguoiDanhGia] = useState("");
  const [document4, setDocument4] = useState<any>();
  const [document5Id, setDocument5Id] = useState<any>();
  const [document4Info, setDocument4Info] = useState<any>();
  const [document5Info, setDocument5Info] = useState<any>();
  
  const [userInfoDocument, setUserInfoDocument] = useState<User>();

  const [login, setLogin] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openDeny, setOpenDeny] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);

  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUserinfo = async () => {
      if (location.pathname.split("/")[3]) {
        const fecthDoc = await apiGetSubMenu5ById(location.pathname.split("/")[3]);
        if (fecthDoc && fecthDoc.data) {
            const doc5Data = fecthDoc.data;
            setDocument5Info(doc5Data);
            const fetchUser = await apiGetUser(doc5Data?.userId);
            if (fetchUser && fetchUser.data)
              setUserInfoDocument(fetchUser?.data)
          }
        }
      }
    
    fetchUserinfo();
  }, [location.pathname]);

  const getTargetElement = () => document.getElementById("main-content");

  useEffect(() => {
    if (
      tieuChi1 &&
      tieuChi2 &&
      tieuChi3 &&
      tieuChi4 &&
      tieuChi5 &&
      tieuChi6 &&
      tieuChi7 &&
      tieuChi8 &&
      tieuChi9 &&
      tieuChi10 &&
      tieuChi11 &&
      tieuChi12
    ) {
      setTongDiem(
        tieuChi1 +
        tieuChi2 +
        tieuChi3 +
        tieuChi4 +
        tieuChi5 +
        tieuChi6 +
        tieuChi7 +
        tieuChi8 +
        tieuChi9 +
        tieuChi10 +
        tieuChi11 +
        tieuChi12
      );
    }
  }, [
    tieuChi1,
    tieuChi10,
    tieuChi11,
    tieuChi12,
    tieuChi2,
    tieuChi3,
    tieuChi4,
    tieuChi5,
    tieuChi6,
    tieuChi7,
    tieuChi8,
    tieuChi9,
  ]);

  const downloadPdf = async () => {
    try {
      const pdf = await generatePDF(getTargetElement, options);
      const formData = new FormData();
      formData.append("files", pdf.output("blob"), "document.pdf");

      const response = await axios.post(
        "https://localhost:7241/api/S3FileUpload/upload?prefix=doc5%2F",
        formData
      );
      if (response?.status === 200) {
        const res = await apiUpdateSubMenu5(
          {
            id: document5Id,
            document4Id: location.pathname.split("/")[3],
            linkFile: response?.data,
            userId: user?.userId,
          },
          document5Id
        );
        if (res && document5Id) {
          alert("Thành công! Hãy chờ đợi trong giây lát để chuyển trang");
          console.log(document5Id);
          navigate(
            `/sub-menu-5/detail-view/${document5Id}`
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (location.pathname.includes("view")) {
      const fecthDoc5Info = async () => {
        const res = await apiGetSubMenu5ById(
          location.pathname.split("/")[3]
        );
        if (res && res.data) {
          setDocument5Info(res.data);
        }
      };
      fecthDoc5Info();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.includes("create")) {
      const fecthDoc4 = async () => {
        const res = await apiGetSubMenu4ById(location.pathname.split("/")[3]);
        if (res && res.data) {
          setDocument4(res.data);
        }
      };
      const fecthDoc4Info = async () => {
        const res = await apiGetSubMenu4infoById(
          location.pathname.split("/")[3]
        );
        if (res && res.data) {
          setDocument4Info(res.data);
        }
      };
      fecthDoc4();
      fecthDoc4Info();
    }
  }, [location.pathname]);

  const handleClose = () => {
    setOpen(false);
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

  const handleClickSave = () => {
    navigate(`/sub-menu-5/detail-edit/${location.pathname.split("/")[3]}`);
  };

  const handleClickOpen = async () => {
    if (
      tiet &&
      user &&
      tieuChi1 &&
      tieuChi2 &&
      tieuChi3 &&
      tieuChi4 &&
      tieuChi5 &&
      tieuChi6 &&
      tieuChi7 &&
      tieuChi8 &&
      tieuChi9 &&
      tieuChi10 &&
      tieuChi11 &&
      tieuChi12
    ) {
      const post = await apiPostSubMenu5({
        name: document4?.name,
        document4Id: document4?.id,
        userId: user?.userId,
        slot: tiet,
        date: document4?.createdDate,
        total:
          tieuChi1 +
          tieuChi2 +
          tieuChi3 +
          tieuChi4 +
          tieuChi5 +
          tieuChi6 +
          tieuChi7 +
          tieuChi8 +
          tieuChi9 +
          tieuChi10 +
          tieuChi11 +
          tieuChi12,
      });
      if (post) {
        setDocument5Id(post?.data?.id);
        setOpen(true);
      }
    } else alert("Nhập đầy đủ thông tin!");
  };
  const handleClickOpen1 = async () => { };

  const handleAddDoc5 = async () => {
    if (
      tiet &&
      user &&
      tieuChi1 &&
      tieuChi2 &&
      tieuChi3 &&
      tieuChi4 &&
      tieuChi5 &&
      tieuChi6 &&
      tieuChi7 &&
      tieuChi8 &&
      tieuChi9 &&
      tieuChi10 &&
      tieuChi11 &&
      tieuChi12
    ) {
      const post = await apiPostEvaluate([
        {
          document5Id: document5Id,
          evaluate11: tieuChi1,
          evaluate12: tieuChi2,
          evaluate13: tieuChi3,
          evaluate14: tieuChi4,
          evaluate21: tieuChi5,
          evaluate22: tieuChi6,
          evaluate23: tieuChi7,
          evaluate24: tieuChi8,
          evaluate31: tieuChi9,
          evaluate32: tieuChi10,
          evaluate33: tieuChi11,
          evaluate34: tieuChi12,
        },
      ]);
      if (post && post.data) {
        setOpen(false);
        downloadPdf();
      }
    }
  };

  const docs = [{ uri: require("./phuluc5.pdf") }];
  return (
    <div className="sub-menu-container">
      {location.pathname?.includes("create") ? (
        <div>
          <div className="sub-menu-content" id="main-content">
            <div className="sub-menu-content-header">
              <div style={{ textAlign: "center" }}>
                <strong className="phu-luc">Phụ lục V</strong>
              </div>
              <div className="sub-menu-content-header-title">
                <strong className="sub-menu-content-header-title-main">
                  MẪU PHIẾU ĐÁNH GIÁ BÀI DẠY
                </strong>
                <div className="sub-menu-content-header-title-sub">
                  <i>
                    (Kèm theo Công văn số 5512/BGDĐT-GDTrH ngày 18 tháng 12 năm
                    2020 của Bộ GDĐT)
                  </i>
                </div>
              </div>
            </div>

            <div
              className="sub-menu-content-title"
              style={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
                margin: "12px auto",
              }}
            >
              <div>
                <strong>PHIẾU ĐÁNH GIÁ BÀI DẠY</strong>
              </div>
              <div style={{ display: "flex" }}>
                <div>
                  Tên bài dạy:
                  {/* <input type="text" placeholder='...............................................................................' style={{ width: "310px" }} onChange={(e) => setBaiDay(e.target.value)} /> */}
                  {document4?.name}
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div>
                  Môn học/ Hoạt động giáo dục:
                  {document4Info?.subjectName}
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div>Lớp: {document4Info?.className}</div>;
                <div>
                  Tiết:{" "}
                  <input
                    type="text"
                    placeholder="........................."
                    style={{ width: "90px" }}
                    onChange={(e) => setTiet(parseInt((e.target as HTMLInputElement).value))}
                  />
                </div>
                ;<div> Ngày: {new Date().toLocaleDateString("vi-VN")}</div>
              </div>
              <div style={{ display: "flex" }}>
                <div>
                  Họ và tên giáo viên thực hiện:
                  {user?.username}
                </div>
              </div>
            </div>

            <div className="sub-menu-content-main">
              <div className="sub-menu-content-main-feature">
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
                          <TableCell align="center">Nội dung</TableCell>
                          <TableCell align="center">Tiêu chí</TableCell>
                          <TableCell align="center">Điểm tối đa</TableCell>
                          <TableCell align="center" sx={{ width: "60px" }}>
                            Điểm đánh giá
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow sx={{ td: { border: 1 } }}>
                          <TableCell align="center" rowSpan={4}>
                            1. Kế hoạch bài dạy
                          </TableCell>
                          <TableCell align="center">
                            Mức độ phù hợp của các hoạt động học với mục tiêu,
                            nội dung và phương pháp dạy học được sử dụng.
                          </TableCell>
                          <TableCell align="center">1,00</TableCell>
                          <TableCell align="center">
                            <input
                              type="number"
                              value={tieuChi1 ?? ""}
                              onChange={(e) => {
                                const newValue = parseFloat((e.target as HTMLInputElement).value);
                                if (
                                  !isNaN(newValue) &&
                                  newValue >= 0 &&
                                  newValue <= 1
                                ) {
                                  setTieuChi1(newValue);
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ td: { border: 1 } }}>
                          <TableCell align="center">
                            Mức độ rõ ràng, chính xác của mục tiêu, nội dung,
                            sản phâm, cách thức tô chức thực hiện môi hoạt động
                            học của học sinh.
                          </TableCell>
                          <TableCell align="center">2,00</TableCell>
                          <TableCell align="center">
                            <input
                              type="number"
                              value={tieuChi2 ?? ""}
                              onChange={(e) => {
                                const newValue = parseFloat((e.target as HTMLInputElement).value);
                                if (
                                  !isNaN(newValue) &&
                                  newValue >= 0 &&
                                  newValue <= 2
                                ) {
                                  setTieuChi2(newValue);
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ td: { border: 1 } }}>
                          <TableCell align="center">
                            Mức độ phù hợp của thiết bị dạy học và học liệu được
                            sử dụng đề tô chức các hoạt động của học sinh{" "}
                          </TableCell>
                          <TableCell align="center">1,00</TableCell>
                          <TableCell align="center">
                            <input
                              type="number"
                              value={tieuChi3 ?? ""}
                              onChange={(e) => {
                                const newValue = parseFloat((e.target as HTMLInputElement).value);
                                if (
                                  !isNaN(newValue) &&
                                  newValue >= 0 &&
                                  newValue <= 1
                                ) {
                                  setTieuChi3(newValue);
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ td: { border: 1 } }}>
                          <TableCell align="center">
                            Mức độ phù hợp của phương án kiểm tra, đánh giá
                            trong quá trình tô chức hoạt động học của học sinh.
                          </TableCell>
                          <TableCell align="center">2,00</TableCell>
                          <TableCell align="center">
                            <input
                              type="number"
                              value={tieuChi4 ?? ""}
                              onChange={(e) => {
                                const newValue = parseFloat((e.target as HTMLInputElement).value);
                                if (
                                  !isNaN(newValue) &&
                                  newValue >= 0 &&
                                  newValue <= 2
                                ) {
                                  setTieuChi4(newValue);
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>

                        <TableRow sx={{ td: { border: 1 } }}>
                          <TableCell align="center" rowSpan={4}>
                            2. Hoạt động của giáo viên
                          </TableCell>
                          <TableCell align="center">
                            Mức độ chính xác, phù hợp, sinh động, hấp dẫn của
                            nội dung, phương pháp và hình thức giao nhiệm vụ học
                            tập cho học sinh.{" "}
                          </TableCell>
                          <TableCell align="center">2,00</TableCell>
                          <TableCell align="center">
                            <input
                              type="number"
                              value={tieuChi5 ?? ""}
                              onChange={(e) => {
                                const newValue = parseFloat((e.target as HTMLInputElement).value);
                                if (
                                  !isNaN(newValue) &&
                                  newValue >= 0 &&
                                  newValue <= 2
                                ) {
                                  setTieuChi5(newValue);
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ td: { border: 1 } }}>
                          <TableCell align="center">
                            Khả năng theo dõi, quan sát, phát hiện kịp thời
                            những khó khăn của học sinh.{" "}
                          </TableCell>
                          <TableCell align="center">2,00</TableCell>
                          <TableCell align="center">
                            <input
                              type="number"
                              value={tieuChi6 ?? ""}
                              onChange={(e) => {
                                const newValue = parseFloat((e.target as HTMLInputElement).value);
                                if (
                                  !isNaN(newValue) &&
                                  newValue >= 0 &&
                                  newValue <= 2
                                ) {
                                  setTieuChi6(newValue);
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ td: { border: 1 } }}>
                          <TableCell align="center">
                            Mức độ phù hợp, hiệu quả của các biện pháp hỗ trợ và
                            khuyến khích học sinh hợp tác, giúp đỡ nhau khi thực
                            hiện nhiệm vụ học tập.
                          </TableCell>
                          <TableCell align="center">2,00</TableCell>
                          <TableCell align="center">
                            <input
                              type="number"
                              value={tieuChi7 ?? ""}
                              onChange={(e) => {
                                const newValue = parseFloat((e.target as HTMLInputElement).value);
                                if (
                                  !isNaN(newValue) &&
                                  newValue >= 0 &&
                                  newValue <= 2
                                ) {
                                  setTieuChi7(newValue);
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ td: { border: 1 } }}>
                          <TableCell align="center">
                            Mức độ chính xác, hiệu quả trong việc tổng hợp, phân
                            tích, đánh giá quá trình và kết quả học tập của học
                            sinh (làm rõ những nội dung/yêu cầu về kiến thức, kĩ
                            năng học sinh cần ghi nhận, thực hiện).
                          </TableCell>
                          <TableCell align="center">2,00</TableCell>
                          <TableCell align="center">
                            <input
                              type="number"
                              value={tieuChi8 ?? ""}
                              onChange={(e) => {
                                const newValue = parseFloat((e.target as HTMLInputElement).value);
                                if (
                                  !isNaN(newValue) &&
                                  newValue >= 0 &&
                                  newValue <= 2
                                ) {
                                  setTieuChi8(newValue);
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>

                        <TableRow sx={{ td: { border: 1 } }}>
                          <TableCell align="center" rowSpan={4}>
                            1. Kế hoạch bài dạy
                          </TableCell>
                          <TableCell align="center">
                            Khả năng tiếp nhận và sẵn sàng thực hiện nhiệm vụ
                            học tập của học sinh trong lớp.
                          </TableCell>
                          <TableCell align="center">2,00</TableCell>
                          <TableCell align="center">
                            <input
                              type="number"
                              value={tieuChi9 ?? ""}
                              onChange={(e) => {
                                const newValue = parseFloat((e.target as HTMLInputElement).value);
                                if (
                                  !isNaN(newValue) &&
                                  newValue >= 0 &&
                                  newValue <= 2
                                ) {
                                  setTieuChi9(newValue);
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ td: { border: 1 } }}>
                          <TableCell align="center">
                            Mức độ tích cực, chủ động, sáng tạo, hợp tác của học
                            sinh trong việc thực hiện các nhiệm vụ học tập.
                          </TableCell>
                          <TableCell align="center">2,00</TableCell>
                          <TableCell align="center">
                            <input
                              type="number"
                              value={tieuChi10 ?? ""}
                              onChange={(e) => {
                                const newValue = parseFloat((e.target as HTMLInputElement).value);
                                if (
                                  !isNaN(newValue) &&
                                  newValue >= 0 &&
                                  newValue <= 2
                                ) {
                                  setTieuChi10(newValue);
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ td: { border: 1 } }}>
                          <TableCell align="center">
                            Mức độ tham gia tích cực của học sinh trong trình
                            bày, thảo luận về kết quả thực hiện nhiệm vụ học
                            tập.{" "}
                          </TableCell>
                          <TableCell align="center">2,00</TableCell>
                          <TableCell align="center">
                            <input
                              type="number"
                              value={tieuChi11 ?? ""}
                              onChange={(e) => {
                                const newValue = parseFloat((e.target as HTMLInputElement).value);
                                if (
                                  !isNaN(newValue) &&
                                  newValue >= 0 &&
                                  newValue <= 2
                                ) {
                                  setTieuChi11(newValue);
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ td: { border: 1 } }}>
                          <TableCell align="center">
                            Mức độ đúng đắn, chính xác, phù hợp của các kết quả
                            thực hiện nhiệm vụ học tập của học sinh.
                          </TableCell>
                          <TableCell align="center">1,00</TableCell>
                          <TableCell align="center">
                            <input
                              type="number"
                              value={tieuChi12 ?? ""}
                              onChange={(e) => {
                                const newValue = parseFloat((e.target as HTMLInputElement).value);
                                if (
                                  !isNaN(newValue) &&
                                  newValue >= 0 &&
                                  newValue <= 2
                                ) {
                                  setTieuChi12(newValue);
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ td: { border: 1 } }}>
                          <TableCell align="center" colSpan={2}>
                            Tổng điểm
                          </TableCell>
                          <TableCell align="center">20,00</TableCell>
                          <TableCell align="center">
                            <input
                              type="number"
                              disabled
                              value={tongDiem ?? ""}
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
              <div
                className="sub-menu-content-main-signature"
                style={{ justifyContent: "flex-end", paddingRight: "100px" }}
              >
                <div className="hieu-truong">
                  <div>
                    <strong>Người đánh giá</strong>
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
            src={document5Info?.linkFile}
            width="100%"
            height="1000px"
            type="application/pdf"
          />
          <div className="sub-menu-infomation">
            <div className="sub-menu-row">
              <div>
                <strong>Người gửi: </strong>{" "}
                <u className="underline-blue">{userInfoDocument?.firstName+" "+userInfoDocument?.lastName}</u>
              </div>
            </div>
            <div className="sub-menu-row">
              <div>
                <strong>Ngày gửi: </strong>{" "}
                <u className="underline-blue">{document5Info?.createdDate}</u>
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
          <Button
            onClick={() => handleAddDoc5()}
            className="button-mui"
            autoFocus
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default SubMenu5Detail;
