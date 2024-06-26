import React, { useEffect, useState } from "react";
import "./style.scss";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { apiGetSubMenu4ById,  apiUpdateSubMenu4 } from "../../api/subMenu4";
import { apiPostReport } from "../../api/report";
import { useAppSelector } from "../../hook/useTypedSelector";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { apiGetUser } from "../../api/user";
import { User } from "../../models/User";
import { apiGetTeachingPlannerById } from "../../api/teachingPlanner";
import { apiPostNotification } from "../../api/notification";

const SubMenu4Detail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [login, setLogin] = useState(false);
  const [open, setOpen] = useState(false);
  const [document4Info, setDocument4Info] = useState<any>();
  const [openReport, setOpenReport] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [reasonReport, setReasonReport] = useState("");
  const [descriptionRp, setDescriptionRp] = useState("");
  const [userInfoLogin, setUserInfoLogin] = useState<User>();
  const [userInfoDocument, setUserInfoDocument] = useState<User>();

  const [openDeny, setOpenDeny] = useState(false);

  const [openAccept, setOpenAccept] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    const fecthDoc4 = async () => {
      const res = await apiGetSubMenu4ById(location.pathname.split("/")[3]);
      if (res && res.data) {
        setDocument4Info(res.data);
      }
    };
    fecthDoc4();
  }, [location.pathname]);

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
    const fetchUserinfo = async () => {
      if (location.pathname.split("/")[3]) {
        const fecthDoc = await apiGetSubMenu4ById(location.pathname.split("/")[3]);
        if (fecthDoc && fecthDoc.data) {
          const doc4Data: any = fecthDoc.data;
          setDocument4Info(doc4Data);
          const fecthTPResult = await apiGetTeachingPlannerById(doc4Data?.teachingPlannerId);
          if (fecthTPResult && fecthTPResult.data) {
            const tpData = fecthTPResult.data;
            const fetchUser = await apiGetUser(tpData?.userId);
            if (fetchUser && fetchUser.data)
              setUserInfoDocument(fetchUser?.data)
          }
        }
      }
    }
    fetchUserinfo();
  }, [location.pathname]);
  const handleCloseAccept = () => {
    setOpenAccept(false);
  };

  const handleCloseDeny = () => {
    setOpenDeny(false);
  };

  const handleClickOpenAccept = () => {
    setOpenAccept(true);
  };

  const handleClickOpenDeny = () => {
    setOpenDeny(true);
  };

  const handleClickOpenReport = () => {
    setOpenReport(true);
  };

  const handleCloseReport = () => {
    setOpenReport(false);
  };

  const handleClickOpenFeedback = () => {
    setOpenFeedback(true);
  };

  const handleCloseFeedback = () => {
    setOpenFeedback(false);
  };

  const handleClickOpenRemove = () => {
    setOpenRemove(true);
  };

  const handleCloseRemove = () => {
    setOpenRemove(false);
  };

  const handleClickEdit = () => {
    navigate(`/sub-menu-4/detail-edit/${location.pathname.split("/")[3]}`);
  };

  const handleSubmitReport = async () => {
    const rp = {
      userId: parseInt(user?.userId),
      doctype: 4,
      docId: document4Info?.id,
      message: reasonReport,
      description: descriptionRp,
    };
    await apiPostReport(rp);
    setOpenReport(false);
  };

  return (
    <div className="sub-menu-container">
      <embed
        src={document4Info?.linkFile}
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
                  parseInt(user?.userId) === userInfoDocument?.id
                    ? "flex"
                    : "none",
                columnGap: "10px",
              }}
            >
              <div className="action-button" onClick={handleClickEdit}>
                Sửa
              </div>
              <div className="action-button" onClick={handleClickOpenRemove}>
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
              {document4Info?.isApprove === 3
                ? "(Tài liệu đã được thẩm định)"
                : "(Tài liệu chưa được thẩm định)"}
            </i>
          </div>
          <div className="right-action" onClick={handleClickOpenReport}>
            <strong>
              <u className="underline-blue">Báo cáo tài liệu có sai sót</u>
            </strong>
          </div>
        </div>
        <div className="sub-menu-row">
          <div>
            <strong>Người gửi: </strong>{" "}
            <u className="underline-blue">{userInfoDocument?.firstName + " " + userInfoDocument?.lastName}</u>
          </div>
          <div
          style={{
            display:
            (user?.role === "Leader" && document4Info?.isApprove === 3 && userInfoLogin?.departmentId === userInfoDocument?.departmentId) ?? user?.role === "Principal"
                ? "flex"
                : "none",
            columnGap: "10px",
          }} 
          className="right-action" onClick={handleClickOpenFeedback}>
            <strong>
              <u className="underline-blue">Tạo đánh giá của bài dạy</u>
            </strong>
          </div>
        </div>
        <div className="sub-menu-row">
        <div>
          <strong>Ngày gửi: </strong>{" "}
          <u className="underline-blue">{document4Info?.createdDate}</u>

        </div>

        <div
            className="right-action"
            onClick={() => {
              navigate(`/sub-menu-5/list-view/${document4Info?.id}`);
            }}
          >
            <strong>
              <u className="underline-blue">Xem các đánh giá khác</u>
            </strong>
          </div>

      </div>
      </div>
      
      <div className="sub-menu-action">
        <div
          className="verify"
          style={{
            display:
              user?.role === "Leader" && document4Info?.isApprove === 2 && userInfoLogin?.departmentId === userInfoDocument?.departmentId
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
                  await apiUpdateSubMenu4(
                    {
                      id: document4Info?.id,
                      teachingPlannerId: document4Info?.teachingPlannerId,
                      isApprove : 3,
                      approveBy : userInfoLogin?.id,
                    },
                    document4Info?.id
                  );
                  await apiPostNotification({
                    receiveBy: [userInfoDocument?.id] || [],
                    sentBy: user?.userId,
                    titleName: `KẾ HOẠCH BÀI DẠY : ${document4Info?.name.toUpperCase()} ĐÃ ĐƯỢC CHẤP NHẬN`,
                    message: `KẾ HOẠCH BÀI DẠY : ${document4Info?.name} ĐÃ ĐƯỢC CHẤP NHẬN`,
                    docType: 4 ,
                    docId: document4Info?.id,
                  });
                  alert("Thành công! Hãy chờ đợi trong giây lát để chuyển trang");
                  navigate(`/sub-menu/4`);
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
                  await apiUpdateSubMenu4(
                    {
                      id: document4Info?.id,
                      document1Id: document4Info?.document1Id,
                      userId: document4Info?.userId,
                      isApprove: 4,
                      approveBy: userInfoLogin?.id,
                    },
                    document4Info?.id
                  );
                  await apiPostNotification({
                    receiveBy: [document4Info?.userId] || [],
                    sentBy: user?.userId,
                    titleName: `KẾ HOẠCH BÀI DẠY : ${document4Info?.name.toUpperCase()} ĐÃ BỊ TỪ CHỐI, HÃY ĐĂNG TẢI LẠI`,
                    message: `KẾ HOẠCH BÀI DẠY : ${document4Info?.name} ĐÃ BỊ TỪ CHỐI, HÃY ĐĂNG TẢI LẠI`,
                    docType: 4,
                    docId: document4Info?.id,
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
        {/* <Dialog
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
                await apiDeleteSubMenu4(location.pathname.split("/")[3]);
                navigate("/sub-menu/3");
              }}
              className="button-mui"
              autoFocus
            >
              Xóa
            </Button>
          </DialogActions>
        </Dialog> */}
      <Dialog
        open={openFeedback}
        onClose={handleCloseFeedback}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{ textAlign: "center", fontWeight: 600 }}
        >
          Chuyển tới đánh giá
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ textAlign: "left", fontWeight: 600, marginBottom: "12px" }}
          >
            Chú ý trước khi chuyển trang:
          </DialogContentText>
          <DialogContentText
            id="alert-dialog-description"
            style={{
              textAlign: "left",
              backgroundColor: "#D9D9D9",
              borderRadius: "20px",
              padding: "20px",
            }}
          >
            Đảm bảo thông tin bài dạy được lưu lại theo đúng mong muốn trước khi
            chuyển sang bước đánh giá bài dạy !
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseFeedback}
            style={{ color: "#000", fontWeight: 600 }}
          >
            {" "}
            Quay lại trang
          </Button>
          <Button
            onClick={() =>
              navigate(`/sub-menu-5/detail-create/${document4Info?.id}`)
            }
            className="button-mui"
            autoFocus
          >
            Click vào đây để sang phụ lục 5
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
            Bạn có chắc muốn xóa thay đổi không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseRemove}
            style={{ color: "#000", fontWeight: 600 }}
          >
            Hủy bỏ
          </Button>
          <Button onClick={handleCloseRemove} className="button-mui" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SubMenu4Detail;
