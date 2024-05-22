import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Remove } from "@mui/icons-material";
import "./style.scss";
import Button from "@mui/material/Button";

const Scrom = () => {
  const grades = ["Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9"];
  const subMenu = [1, 2, 3];
  const navigate = useNavigate();

  return (
    <div className="scrom-panel">
      <div className="scrom-panel-content">
        <div className="scrom-panel-content-sub-menu">
          <div className="scrom-panel-content-sub-menu-list">
            <div className="scrom-panel-content-sub-menu-item-name">
              <div className="add-row-button">
                <Link to="/upload-bai-giang">Đưa eleaning lên</Link>
              </div>
            </div>
            {grades?.map((grade, index) => (
              <div>
                <div
                  className="grade-name"
                  style={{ fontSize: "24px" }}
                  onClick={() => navigate(`${grade}`)}
                >
                  {grade}
                </div>
                <div
                  className="scrom-panel-content-sub-menu-item-content-grid"
                  style={{
                    borderBottom:
                      index === grades.length - 1 ? "none" : "1px solid black",
                  }}
                >
                  {subMenu?.map((item, index) => (
                    <div
                      key={index}
                      className="sub-menu-content-detail"
                      onClick={() => navigate("/sub-menu-1/detail-view")}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scrom;
