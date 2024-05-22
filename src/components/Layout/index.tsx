import React, { ReactNode } from "react";
import { Grid, TextField } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import LeftSubNavBar from "./SubNavBar/LeftSubNavBar";
import RightSubNavBar from "./SubNavBar/RightSubNavbar";
import { SearchOutlined } from "@mui/icons-material";
import "./style.scss";
import { useAppSelector } from "../../hook/useTypedSelector";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Header />
      <Grid container spacing={2} style={{ marginTop: "100px" }}>
        <LeftSubNavBar />
        <Grid item xs={8} style={{ padding: "24px 64px" }}>
          {/* <div className="search-panel">
                        <span>Search</span>
                        <div className='search-panel-input'>
                            <TextField id="outlined-basic" label="Tìm kiếm" variant="outlined" className='search-panel-input-textField' />
                            <div className='search-panel-icon'>
                                <SearchOutlined style={{ color: "#fff" }} />
                            </div>
                        </div>
                    </div> */}
          {children}
        </Grid>

        <RightSubNavBar />
      </Grid>
      <Footer />
    </div>
  );
};

export default Layout;
