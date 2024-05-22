import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import "../style.scss";
import {
  Article,
  Folder,
  Note,
  NotificationsActive,
  Square,
} from "@mui/icons-material";
import {
  apiGetSpecializedDepartment,
  apiGetSpecializedDepartmentById,
} from "../../../../api/specializedDepartment";
import axios from "axios";
import { base_url } from "../../../../utils/baseUrl";
import { Link, useNavigate } from "react-router-dom";
import { apiGetNotificationByReceiverId } from "../../../../api/notification";
import { useAppSelector } from "../../../../hook/useTypedSelector";

const LeftSubNavBar = () => {
  const navigate = useNavigate();
  const [depts, setDepts] = useState<any>([]);
  const [notis, setNotis] = useState<any>([]);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const getDepartmentHandler = async () => {
      await apiGetSpecializedDepartment().then((res) => {
        setDepts(res.data);
      });
    };

    const fecthNotis = async () => {
      if (user?.userId) {
        const res = await apiGetNotificationByReceiverId(user?.userId);
        if (res && res.data) {
          setNotis(res.data);
        }
      }
    };
    getDepartmentHandler();
    fecthNotis();
  }, [user?.userId]);

  return (
    <Grid item xs={2} style={{ padding: 0 }}>
      <div className="sub-nav-bar sub-nav-bar-left">
        <div className="sub-nav-bar-item">
          <div className="sub-nav-bar-item-name">Thư mục</div>
          <div className="sub-nav-bar-item-content">
            <div className="sub-nav-bar-item-content-folder">
              {depts?.map((dep: any, index: any) => (
                <>
                  <Document dep={dep} />
                </>
              ))}
            </div>
          </div>
        </div>
        <div className="sub-nav-bar-item">
          <div className="sub-nav-bar-item-name">Thông báo</div>
          <div
            className="sub-nav-bar-item-content"
            style={{ paddingTop: "12px" }}
          >
            <div className="sub-nav-bar-item-detail">
              {notis?.map((noti: any, index: any) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    columnGap: "12px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    navigate(
                      `/sub-menu-${noti?.docType}/detail-view/${noti?.docId}`
                    )
                  }
                >
                  <NotificationsActive
                    style={{ color: "rgb(239, 179, 142)" }}
                  />
                  {noti?.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Grid>
  );
};

const Document = ({ dep }: any) => {
  const [documents, setDocuments] = useState<any>([]);
  const [show, setShow] = useState<any>(false);

  useEffect(() => {
    const getDocument = async () => {
      var doc1 = await axios.get(
        base_url +
        "Document1/GetDoc1ByUserDepartment?listId=" +
        dep.id
      );
      var doc2 = await axios.get(
        base_url +
        "Document2/GetDoc2ByUserDepartment?listId=" +
        dep.id
      );
      var doc3 = await axios.get(
        base_url +
        "Document3/GetDoc3ByUserDepartment?listId=" +
        dep.id
      );
      var doc4 = await axios.get(
        base_url +
        "Document4/GetDocument4ByUserSpecialiedDepartment?listId=" +
        dep.id
      );
      var rs1 = doc1?.data[0]?.documents.map((item: any) => {
        return { ...item, submenu: 1 };
      });
      var rs2 = doc2?.data[0]?.documents.map((item: any) => {
        return { ...item, submenu: 2 };
      });
      var rs3 = doc3?.data[0]?.documents.map((item: any) => {
        return { ...item, submenu: 3 };
      });
      var rs4 = doc4?.data[0]?.documents ? doc4.data[0].documents.map((item: any) => {
        return { ...item, submenu: 4 };
      }) : [];
      //setDocuments([...doc1.data[1]?.documents, ...doc2.data[2]?.documents, ...doc3.data[3]?.documents, ...doc4.data[4]?.documents]);
      setDocuments([...rs1, ...rs2, ...rs3, ...rs4]);
    };

    getDocument();
  }, [dep.id]);

  return (
    <>
      <div
        className="sub-nav-bar-item-content-folder-name"
        onClick={() => setShow(!show)}
      >
        <Folder style={{ width: "30", height: "30", color: "orange" }} />
        <div>{dep.name}</div>
      </div>
      <div className={show ? "nav-is-show" : "nav-is-hidden"}>
        {documents.map((doc: any) => (
          <Link
            key={doc.id}
            to={`/sub-menu-${doc.submenu}/detail-view/${doc.id}`}
          >
            <div className="sub-nav-bar-item-content-folder-course">
              <Article
                style={{ width: "30px", height: "30px", color: "#EFB38E" }}
              />
              {doc.name}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default LeftSubNavBar;
