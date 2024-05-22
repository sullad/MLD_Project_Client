import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import "./style.scss";
import {
  apiGetDocument1ByUserSpecialiedDepartment,
  apiGetSubMenu1,
} from "../../api/subMenu1";
import { SubMenuData } from "../../models/subMenu";
import {
  apiGetDocument4ByUserSpecialiedDepartment,
  apiGetSubMenu4,
} from "../../api/subMenu4";
import {
  apiGetDocument2ByUserSpecialiedDepartment,
  apiGetSubMenu2,
} from "../../api/subMenu2";
import {
  apiGetDocument3ByUserSpecialiedDepartment,
  apiGetSubMenu3,
} from "../../api/subMenu3";
import {
  apiGetDocument5ByUserSpecialiedDepartment,
  apiGetSubMenu5,
} from "../../api/subMenu5";
import { apiGetSpecializedDepartment } from "../../api/specializedDepartment";
import { useAppSelector } from "../../hook/useTypedSelector";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  Pagination,
} from "@mui/material";

import { useMediaQuery } from "@mui/material";

const SubMenu = () => {
  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  const location = useLocation();
  const navigate = useNavigate();
  const [subMenu1Data, setSubMenu1Data] = useState<SubMenuData[]>([]);
  const [subMenu5Data, setSubMenu5Data] = useState<SubMenuData[]>([]);
  const [specializedDepartmentId, setSpecializedDepartmentID] = useState<any>(
    []
  );
  const [specializedDepartment, setSpecializedDepartment] = useState<any>([]);
  const [subMenuName, setSubMenuName] = useState("");
  const indexSubMenu = location.pathname.split("/")[2];
  const user = useAppSelector((state) => state.auth.user);
  const grades = useMemo(() => ["6", "7", "8", "9"], []);
  const handleAddSubMenu = () => {
    navigate(`/sub-menu-${indexSubMenu}/detail-create`);
  };

  const matches = useMediaQuery("(max-width:600px)");
  const matchesPhone = useMediaQuery("(max-width:400px)");

  let columnCount;
  if (matchesPhone) {
    columnCount = 1;
  } else if (matches) {
    columnCount = 2;
  } else {
    columnCount = 3;
  }

  const [pages, setPages] = useState(Array(subMenu1Data.length).fill(1));
  const itemsPerPage = 6;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
    index: number
  ) => {
    setPages((prevPages) => {
      const newPages = [...prevPages];
      newPages[index] = value;
      return newPages;
    });
  };

  useEffect(() => {
    if (indexSubMenu === "1")
      setSubMenuName(
        "KẾ HOẠCH DẠY HỌC CỦA TỔ CHUYÊN MÔN MÔN HỌC/HOẠT ĐỘNG GIÁO DỤC"
      );
    else if (indexSubMenu === "2")
      setSubMenuName(
        "KẾ HOẠCH TỔ CHỨC CÁC HOẠT ĐỘNG GIÁO DỤC CỦA TỔ CHUYÊN MÔN "
      );
    else if (indexSubMenu === "3")
      setSubMenuName("KẾ HOẠCH GIÁO DỤC CỦA GIÁO VIÊN");
    else if (indexSubMenu === "4") setSubMenuName("KHUNG KẾ HOẠCH BÀI DẠY");
    else if (indexSubMenu === "5") setSubMenuName("PHIẾU ĐÁNH GIÁ BÀI DẠY");
  }, [indexSubMenu]);

  useEffect(() => {
    const fetchList = async () => {
      if (indexSubMenu === "1") {
        const res = await apiGetDocument1ByUserSpecialiedDepartment(
          specializedDepartmentId
        );
        if (res) {
          setSubMenu1Data(res.data);
          setPages(Array(res.data.length).fill(1));
        } else setSubMenu1Data([]);
      } else if (indexSubMenu === "2") {
        const res = await apiGetDocument2ByUserSpecialiedDepartment(
          specializedDepartmentId
        );
        if (res) {
          setSubMenu1Data(res.data);
          setPages(Array(res.data.length).fill(1));
        } else setSubMenu1Data([]);
      } else if (indexSubMenu === "3") {
        const res = await apiGetDocument3ByUserSpecialiedDepartment(
          specializedDepartmentId
        );
        if (res) {
          setSubMenu1Data(res.data);
          setPages(Array(res.data.length).fill(1));
        } else setSubMenu1Data([]);
      } else if (indexSubMenu === "4") {
        const res = await apiGetDocument4ByUserSpecialiedDepartment(
          specializedDepartmentId
        );
        if (res) {
          setSubMenu1Data(res.data);
          setPages(Array(res.data.length).fill(1));
        } else setSubMenu1Data([]);
      } else if (indexSubMenu === "5") {
        const res = await apiGetSubMenu5();
        if (res) setSubMenu5Data(res.data);
        else setSubMenu5Data([]);
      }
    };
    fetchList();
  }, [indexSubMenu, specializedDepartmentId]);

  useEffect(() => {
    setPages(Array(subMenu1Data.length).fill(1));
  }, [indexSubMenu, specializedDepartmentId, subMenu1Data.length]);

  useEffect(() => {
    if (indexSubMenu !== "5") {
      const fetchSpecializedDepartment = async () => {
        const res = await apiGetSpecializedDepartment();
        if (res && res.data) {
          setSpecializedDepartment(res.data);
          const idArray = res.data.map((item: any) => item.id);
          const queryString = idArray
            .map((id: any) => `listId=${id}`)
            .join("&");
          setSpecializedDepartmentID(queryString);
          console.log("queryString: ", queryString)
        }
      };
      fetchSpecializedDepartment();
    }
  }, [indexSubMenu]);
  const imageurl =
    "https://png.pngtree.com/png-vector/20190701/ourlarge/pngtree-document-icon-for-your-project-png-image_1533118.jpg";

  const displayStyle =
    indexSubMenu === "3" || user?.role !== "Leader" ? "none" : "initial";
  return (
    <div className="home-panel" style={{ minWidth: "20rem" }}>
      <div className="home-panel1-content">
        <div className="home-panel1-content-sub-menu">
          <div className="home-panel1-content-sub-menu-list">
            <div className="home-panel1-content-sub-menu-item-name">
              <div>{subMenuName}</div>
              <div className="add-row-button">
                {indexSubMenu !== "4" ? (
                  <Add
                    style={{ color: "black", display: `${displayStyle}` }}
                    className="add-row-icon"
                    onClick={handleAddSubMenu}
                  />
                ) : (
                  <Add
                    style={{
                      color: "black",
                      display: user?.role !== "Teacher" ? "none" : "initial",
                    }}
                    className="add-row-icon"
                    onClick={() => navigate("/upload-sub-menu-4")}
                  />
                )}
              </div>
            </div>

            <form action="">
              <div className="input-group mb-4 border rounded-pill p-1 bg-white rounded">
                <div className="input-group-prepend border-0">
                  <button
                    id="button-addon4"
                    type="button"
                    className="btn btn-link text-info"
                  >
                    <i className="fa fa-search"></i>
                  </button>
                </div>
                <input
                  type="search"
                  placeholder="Tìm kiếm tài liệu..."
                  aria-describedby="button-addon4"
                  className="form-control bg-none border-0"
                />
              </div>
              <div className="container d-flex justify-content-center align-items-center"></div>
            </form>

            <div>
              <FormControl style={{ width: "15%", background: "white" }}>
                <InputLabel id="demo-simple-select-label">Tổ</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="Age"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </div>
            {indexSubMenu !== "5" &&
              subMenu1Data?.map((doc, index) => (
                <div key={index}>
                  <div className="grade-name" style={{ fontSize: "20px" }}>
                    Tổ {specializedDepartment[index]?.name}
                  </div>
                  <div
                    className="home-panel1-content-sub-menu-item-content-grid justify-content-center align-items-center"
                    style={{
                      borderBottom:
                        index === grades.length - 1
                          ? "none"
                          : "1px solid black",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="home-panel1-content-sub-menu-item-content-grid justify-content-center align-items-center"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "1rem",
                        width: "100%",
                      }}
                    >
                      {doc?.documents
                        ?.slice(
                          (pages[index] - 1) * itemsPerPage,
                          pages[index] * itemsPerPage
                        )
                        .map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="sub-menu-content-detail"
                            onClick={() =>
                              navigate(
                                `/sub-menu-${indexSubMenu}/detail-view/${item?.id}`
                              )
                            }
                            style={{
                              backgroundImage: item?.linkImage
                                ? `url('${item?.linkImage}')`
                                : `url('${imageurl}')`,
                              maxWidth: "250px",
                              flex: "1 0 auto",
                            }}
                          >
                            <div className="sub-menu-subject-name">
                              {item.name}
                            </div>
                          </div>
                        ))}
                    </div>
                    {doc?.documents?.length > 6 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Pagination
                          count={Math.ceil(
                            doc?.documents?.length / itemsPerPage
                          )}
                          page={pages[index]}
                          onChange={(event, value) =>
                            handlePageChange(event, value, index)
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            {indexSubMenu === "5" &&
              subMenu5Data?.map((doc: any, index) => (
                <div key={index}>
                  <div
                    className="home-panel1-content-sub-menu-item-content-grid"
                    style={{
                      borderBottom:
                        index === grades.length - 1
                          ? "none"
                          : "1px solid black",
                    }}
                  >
                    {
                      <div
                        key={index}
                        className="sub-menu-content-detail"
                        onClick={() =>
                          navigate(
                            `/sub-menu-${indexSubMenu}/detail-view/${doc?.id}`
                          )
                        }
                      ></div>
                    }
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubMenu;
