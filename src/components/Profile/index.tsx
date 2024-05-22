import React, { useEffect, useState } from "react";
import "./style.scss";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Edit, Lock, Password } from "@mui/icons-material";
import { useAppSelector } from "../../hook/useTypedSelector";
import { apiGetUser, apiupdateUser } from "../../api/user";
import axios from "axios";
import { apiCheckVerifyPassword } from "../../api/auth";
import Grid from "@mui/material/Grid";

const Profile = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userInfo, setUserInfo] = useState<any>();
  const [openCode, setOpenCode] = useState(false);

  const user = useAppSelector((state) => state.auth.user);

  const cancelEdit = () => {
    setOpenEdit(!openEdit);
  };

  const handleCodeClose = () => {
    setOpenCode(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        const res = await apiGetUser(user?.userId);
        if (res) setUserInfo(res.data);
      }
    };
    fetchUser();
  }, [user?.userId, user]);

  const handleAvatarChange = async (e: any) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setAvatar(file);
      const blob = new Blob([file], { type: file.type });
      const formData = new FormData();
      formData.append("files", blob, file.name);
      const response = await axios.post(
        "https://localhost:7241/api/S3FileUpload/upload?prefix=images%2F",
        formData
      );
      if (response?.status === 200) setAvatarUrl(response.data);
    }
  };

  return (
    <div className="profile-panel">
      <div className="profile-panel-container">
        <div className="profile-panel-container-title">
          Thông tin thành viên
        </div>
        <div className="profile-panel-container-detail">
          <div className="profile-panel-container-detail-avatar">
            <img
              src={
                userInfo?.photo
                  ? userInfo?.photo
                  : "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg"
              }
              alt="avatar"
              className="profile-panel-container-detail-avatar"
            />
          </div>

          <div className="profile-panel-container-detail-description">
            <div className="profile-panel-container-detail-description-content">
              <div className="profile-detail-field">Họ và tên</div>
              <div className="profile-detail-value">{userInfo?.fullName}</div>
            </div>
            <div className="profile-panel-container-detail-description-content">
              <div className="profile-detail-field">Email</div>
              <div className="profile-detail-value">{userInfo?.email}</div>
            </div>
            <div className="profile-panel-container-detail-description-content">
              <div className="profile-detail-field">Giới tính</div>
              <div className="profile-detail-value">
                {userInfo?.gender ? "Nam" : "Nữ"}
              </div>
            </div>
            <div className="profile-panel-container-detail-description-content">
              <div className="profile-detail-field">Địa chỉ</div>
              <div className="profile-detail-value">{userInfo?.address}</div>
            </div>
            <div className="profile-panel-container-detail-description-content">
              <div className="profile-detail-field">Ngày sinh</div>
              <div className="profile-detail-value">
                {userInfo?.placeOfBirth}
              </div>
            </div>
            <div className="profile-panel-container-detail-description-content">
              <div
                className="profile-edit-btn"
                onClick={() => setOpenEdit(true)}
              >
                <Edit /> Chỉnh sửa thông tin
              </div>
              <div className="profile-panel-container-detail-description-content">
                <div
                  className="profile-edit-btn"
                  onClick={() => setOpenCode(true)}
                >
                  <Lock /> Thay đổi mật khẩu
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openEdit}
        onClose={cancelEdit}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.Email;
            const address = formJson.Address;
            try {
              if (avatarUrl)
                await apiupdateUser(
                  {
                    email: email,
                    address: address,
                    photo: avatarUrl,
                    id: userInfo?.id,
                    accountId: userInfo?.accountId,
                  },
                  userInfo?.id
                );
              else
                await apiupdateUser(
                  {
                    email: email,
                    address: address,
                    id: userInfo?.id,
                    accountId: userInfo?.accountId,
                  },
                  userInfo?.id
                );
              alert("Thay đổi thành công");
              window.location.reload();
              setOpenEdit(!openEdit);
            } catch (e) {
              console.log(e);
            }
          },
        }}
      >
        <DialogTitle style={{ textAlign: "center" }}>
          Thông tin cá nhân
        </DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <DialogContentText>Chỉnh sửa thông tin cá nhân</DialogContentText>
          <div
            style={{
              marginTop: "12px",
              display: "flex",
              width: "50%",
              justifyContent: "space-between",
            }}
          >
            <label htmlFor="avatar">Chọn ảnh đại diện</label>
            <input
              type="file"
              id="Avatar"
              name="Avatar"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
          <TextField
            autoFocus
            required
            margin="dense"
            id="Email"
            name="Email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            defaultValue={userInfo?.email ?? ""}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="Address"
            name="Address"
            label="Address"
            type="Address"
            fullWidth
            variant="standard"
            defaultValue={userInfo?.address}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelEdit}>Cancel</Button>
          <Button type="submit">Edit</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openCode}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            handleCodeClose();
          }
        }}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const curPass = formJson.curPass;
            const password = formJson.password;
            const cfPassword = formJson.cfPassword;
            try {
              if (password !== cfPassword) alert("Confirm password not match");
              if (password && cfPassword && curPass) {
                const res = await apiCheckVerifyPassword(null, {
                  username: user?.username.trim(),
                  currentPassword: curPass,
                  newPassword: password,
                });
                setOpenCode(false);
              }
            } catch (e) {
              console.log(e);
              alert("Something went wrong");
            }
          },
        }}
      >
        <DialogTitle style={{ textAlign: "center" }}>
          Nhập mật khẩu mới
        </DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <DialogContentText>
            Nhập mật khẩu hiện tại và mật khẩu mới
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="curPass"
            name="curPass"
            label="Current password"
            type="password"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="cfPassword"
            name="cfPassword"
            label="Confirm Password"
            type="password"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCodeClose}>Cancel</Button>
          <Button type="submit">Send</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Profile;
