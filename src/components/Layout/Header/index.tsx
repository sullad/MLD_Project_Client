import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Tooltip,
  List,
  ListItem,
  IconButton,
  Drawer,
  Collapse,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../hook/useTypedSelector";
import {
  checkAuthenticationUser,
  loginUser,
} from "../../../features/user/userSlice";
import { apiCheckVerifyPassword, apiPostSendEmail } from "../../../api/auth";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {
  ExpandLess,
  ExpandMore,
  Home,
  Book,
  Newspaper,
  Help,
} from "@mui/icons-material";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isScrolling, setIsScrolling] = useState(false);
  const [openLogin, setOpenlogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openCode, setOpenCode] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const loginStatus = useAppSelector((state) => state.auth.loginStatus);
  const authStatus = useAppSelector((state) => state.auth.authStatus);
  // const [user, setUser] = useState<string | null>('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        (event.type === "keydown" &&
          (event as React.KeyboardEvent).key === "Tab") ||
        (event as React.KeyboardEvent).key === "Shift"
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleAppendixClick = (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    event.stopPropagation();
    setOpenAppendix(!openAppendix);
  };

  const handleNewsClick = (event: React.KeyboardEvent | React.MouseEvent) => {
    event.stopPropagation();
    setOpenNews(!openNews);
  };

  const handleAccClick = (event: React.KeyboardEvent | React.MouseEvent) => {
    event.stopPropagation();
    setOpenAcc(!openAcc);
  };

  const [openAppendix, setOpenAppendix] = useState(false);
  const [openNews, setOpenNews] = useState(false);
  const [openAcc, setOpenAcc] = useState(false);

  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {/* Add your menu items here */}
        <ListItem button onClick={() => setOpenAcc(!openAcc)}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div
              onClick={handleAccClick}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AccountCircle
                style={{
                  width: "32px",
                  height: "32px",
                  color: "#CD8D7A",
                }}
              />
              {user && (
                <span
                  style={{ fontSize: "16px", color: "#000", marginLeft: "5px" }}
                >
                  {user.username}
                </span>
              )}
              {openAcc ? (
                <ExpandLessIcon onClick={handleAccClick} />
              ) : (
                <ExpandMoreIcon onClick={handleAccClick} />
              )}
            </div>
            <Collapse in={openAcc} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  style={{ listStyleType: "none", paddingLeft: "20px" }}
                >
                  <Link to="/profile" style={{ color: "black" }}>
                    Thông tin tài khoản
                  </Link>
                </ListItem>
                <ListItem
                  button
                  style={{ listStyleType: "none", paddingLeft: "20px" }}
                >
                  <Link to="/yeu-cau-phe-duyet" style={{ color: "black" }}>
                    Yêu cầu phê duyệt
                  </Link>
                </ListItem>
                <ListItem
                  button
                  style={{ listStyleType: "none", paddingLeft: "20px" }}
                >
                  <Link
                    to="/"
                    style={{ color: "black" }}
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </Link>
                </ListItem>
              </List>
            </Collapse>
          </div>
        </ListItem>
        <ListItem button>
          <Home />
          <Link to="/" style={{ color: "black" }}>
            TRANG CHỦ
          </Link>
        </ListItem>
        <ListItem button onClick={() => setOpenAppendix(!openAppendix)}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Book />
              <Link
                to="/"
                onClick={handleAppendixClick}
                style={{ color: "black" }}
              >
                PHỤ LỤC
              </Link>
              {openAppendix ? (
                <ExpandLessIcon onClick={handleAppendixClick} />
              ) : (
                <ExpandMoreIcon onClick={handleAppendixClick} />
              )}
            </div>
            <Collapse in={openAppendix} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  style={{ listStyleType: "none", paddingLeft: "20px" }}
                >
                  <Link to="/sub-menu/1" style={{ color: "black" }}>
                    PHỤ LỤC 1
                  </Link>
                </ListItem>
                <ListItem
                  button
                  style={{ listStyleType: "none", paddingLeft: "20px" }}
                >
                  <Link to="/sub-menu/2" style={{ color: "black" }}>
                    PHỤ LỤC 2
                  </Link>
                </ListItem>
                <ListItem
                  button
                  style={{ listStyleType: "none", paddingLeft: "20px" }}
                >
                  <Link to="/sub-menu/3" style={{ color: "black" }}>
                    PHỤ LỤC 3
                  </Link>
                </ListItem>
                <ListItem
                  button
                  style={{ listStyleType: "none", paddingLeft: "20px" }}
                >
                  <Link to="/sub-menu/4" style={{ color: "black" }}>
                    PHỤ LỤC 4
                  </Link>
                </ListItem>
              </List>
            </Collapse>
          </div>
        </ListItem>
        <ListItem button>
          <Book />
          <Link to="/bai-giang-scrom" style={{ color: "black" }}>
            BÀI GIẢNG SCROM
          </Link>
        </ListItem>
        <ListItem button onClick={() => setOpenNews(!openNews)}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Newspaper />
              <Link to="/" onClick={handleNewsClick} style={{ color: "black" }}>
                TIN TỨC
              </Link>
              {openNews ? (
                <ExpandLessIcon onClick={handleNewsClick} />
              ) : (
                <ExpandMoreIcon onClick={handleNewsClick} />
              )}
            </div>
            <Collapse in={openNews} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  style={{ listStyleType: "none", paddingLeft: "20px" }}
                >
                  <Link to="/" style={{ color: "black" }}>
                    TIN TỨC 1
                  </Link>
                </ListItem>
                <ListItem
                  button
                  style={{ listStyleType: "none", paddingLeft: "20px" }}
                >
                  <Link to="/" style={{ color: "black" }}>
                    TIN TỨC 2
                  </Link>
                </ListItem>
                <ListItem
                  button
                  style={{ listStyleType: "none", paddingLeft: "20px" }}
                >
                  <Link to="/" style={{ color: "black" }}>
                    TIN TỨC 3
                  </Link>
                </ListItem>
                <ListItem
                  button
                  style={{ listStyleType: "none", paddingLeft: "20px" }}
                >
                  <Link to="/" style={{ color: "black" }}>
                    TIN TỨC 4
                  </Link>
                </ListItem>
              </List>
            </Collapse>
          </div>
        </ListItem>

        <ListItem button>
          <Help />
          <Link to="/" style={{ color: "black" }}>
            HỖ TRỢ
          </Link>
        </ListItem>
        {/* ... */}
      </List>
    </div>
  );

  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const verifyToken = async () => {
      await dispatch(checkAuthenticationUser());
    };
    verifyToken();
  }, [dispatch, isLogin]);

  console.log(location.pathname.split("/"));

  useEffect(() => {
    if (authStatus === 1) {
      setOpenlogin(false);
    }
    if (authStatus === 0) {
      if (location.pathname !== "/") navigate("/");
      setOpenlogin(true);
    }
  }, [authStatus, location.pathname, navigate]);

  useEffect(() => {
    if (loginStatus === 4) {
      setOpenCode(true);
    }
  }, [loginStatus]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 0) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLoginClickOpen = () => {
    setOpenlogin(true);
  };

  const handleLoginClose = () => {
    setOpenlogin(false);
  };

  const handleRegisterClose = () => {
    setOpenRegister(false);
  };

  const handleCodeClose = () => {
    setOpenCode(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
    setIsLogin(false);
  };
  return (
    <div className={`header  ${isScrolling ? "scroll" : ""}`}>
      <div className="container">
        <div className="left-header">
          <div className="logo-header">
            <Link to="/">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Circle-icons-document.svg"
                alt="logo"
              />
            </Link>
          </div>
          <div className="text-header">
            <p>E-LESSON MANAGEMENT</p>
          </div>
        </div>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
          className="hamburger-menu"
        >
          <MenuIcon />
        </IconButton>
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
        <div className="right-header">
          <div className="nav-list">
            <div className="item-header">
              <Link to="/">TRANG CHỦ</Link>
            </div>
            <div className="item-header">
              <Link to="/">PHỤ LỤC</Link>
              <ul className="dropdown">
                <li>
                  <Link to="/sub-menu/1">PHỤ LỤC 1</Link>
                </li>
                <li>
                  <Link to="/sub-menu/2">PHỤ LỤC 2</Link>
                </li>
                <li>
                  <Link to="/sub-menu/3">PHỤ LỤC 3</Link>
                </li>
                <li>
                  <Link to="/sub-menu/4">PHỤ LỤC 4</Link>
                </li>
              </ul>
            </div>
            <div className="item-header">
              <Link to="/bai-giang-scrom">BÀI GIẢNG SCROM</Link>
            </div>
            <div className="item-header">
              <Link to="/">TIN TỨC</Link>
              <ul className="dropdown">
                <li>
                  <Link to="/">TIN TỨC 1</Link>
                </li>
                <li>
                  <Link to="/">TIN TỨC 2</Link>
                </li>
                <li>
                  <Link to="/">TIN TỨC 3</Link>
                </li>
                <li>
                  <Link to="/">TIN TỨC 4</Link>
                </li>
              </ul>
            </div>
            <div className="item-header">
              <Link to="/">HỖ TRỢ</Link>
            </div>
            <div className="item-header">
              {!user ? (
                <div className="action-header">
                  <button className="login" onClick={handleLoginClickOpen}>
                    ĐĂNG NHẬP
                  </button>
                </div>
              ) : (
                <div>
                  <Tooltip
                    componentsProps={{
                      tooltip: {
                        sx: {
                          backgroundColor: "white",
                          position: "absolute",
                          right: "-100px",
                          left: "auto",
                          top: "-15px",
                          padding: "12px 0 12px 0",
                          width: "200px",
                          textAlign: "center",
                          boxShadow: "0px 0px 10px 0px #ccc",
                        },
                      },
                    }}
                    title={
                      <Container>
                        <ul>
                          <div
                            style={{
                              borderBottom: "1px solid  #ccc",
                              paddingTop: "12px",
                            }}
                          >
                            <span style={{ fontSize: "16px", color: "#000" }}>
                              {user.username}
                            </span>
                          </div>
                          <div
                            style={{
                              borderBottom: "1px solid  #ccc",
                              paddingTop: "12px",
                            }}
                          >
                            <Link to="/profile" style={{ fontSize: "16px" }}>
                              Thông tin tài khoản
                            </Link>
                          </div>
                          <div
                            style={{
                              borderBottom: "1px solid  #ccc",
                              paddingTop: "12px",
                            }}
                          >
                            <Link
                              to="/yeu-cau-phe-duyet"
                              style={{ fontSize: "16px" }}
                            >
                              Yêu cầu phê duyệt
                            </Link>
                          </div>
                          <div style={{ paddingTop: "12px" }}>
                            <span
                              onClick={handleLogout}
                              style={{
                                cursor: "pointer",
                                color: "#000",
                                fontSize: "16px",
                              }}
                            >
                              Đăng xuất
                            </span>
                          </div>
                        </ul>
                      </Container>
                    }
                  >
                    <AccountCircle
                      style={{
                        width: "32px",
                        height: "32px",
                        color: "#CD8D7A",
                      }}
                    />
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openLogin}
        onClose={async (event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            handleLoginClose();
          }
        }}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const username = formJson.username;
            const password = formJson.password;
            try {
              await dispatch(loginUser({ username, password }));
              setIsLogin(true);
              setOpenlogin(false);
            } catch (e) {
              console.log(e);
            }
          },
        }}
      >
        <DialogTitle style={{ textAlign: "center" }}>Đăng nhập</DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <DialogContentText>Điền đầy đủ thông tin đăng nhập</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="username"
            name="username"
            label="Username"
            type="text"
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
          <div style={{ paddingTop: "12px" }}>
            Bạn quên mật khẩu?
            <span
              style={{
                cursor: "pointer",
                fontStyle: "italic",
                marginLeft: "6px",
              }}
              onClick={() => {
                setOpenlogin(false);
                setOpenRegister(true);
              }}
            >
              <u>Lấy lại mật khẩu</u>
            </span>
          </div>
        </DialogContent>
        <DialogActions>
          <Button type="submit">Login</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openRegister}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            handleRegisterClose();
          }
        }}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            try {
              await apiPostSendEmail(email);
              handleRegisterClose();
              setOpenCode(true);
            } catch (e) {
              console.log(e);
              alert("User Not Found");
            }
          },
        }}
      >
        <DialogTitle style={{ textAlign: "center" }}>Quên mật khẩu</DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <DialogContentText>
            Nhập email đă đăng ký để lấy lại mật khẩu
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRegisterClose}>Cancel</Button>
          <Button type="submit">Send</Button>
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
            const username = formJson.username;
            const curPass = formJson.curPass;
            const password = formJson.password;
            const cfPassword = formJson.cfPassword;
            try {
              if (password !== cfPassword) alert("Confirm password not match");
              if (password && cfPassword && username && curPass) {
                const res = await apiCheckVerifyPassword(null, {
                  username: username,
                  currentPassword: curPass,
                  newPassword: password,
                });
                setOpenCode(false);
              }
              handleRegisterClose();
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
            id="username"
            name="username"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
          />
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

export default Header;
