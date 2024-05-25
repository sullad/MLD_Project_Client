import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiGetDoc3ByDoc1Id } from '../../api/subMenu3'
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { apiGetDoc5ByDoc4Id } from '../../api/subMenu5'

function SubMenu5List() {
    const location = useLocation()
    const navigate = useNavigate()
    const [subMenuData, setSubMenuData] = useState<Document[]>([])
    const [age, setAge] = React.useState("");

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };
    useEffect(() => {
        const fetchSubMenu5 = async () => {
            const data = await apiGetDoc5ByDoc4Id(parseInt(location.pathname.split("/")[3]))
            if (data && data.data) {
                setSubMenuData(data.data)
            }
        }
        fetchSubMenu5()
    }, [location.pathname])
    return (
        <Layout>
            <div className="home-panel" style={{ minWidth: "20rem" }}>
                <div className="home-panel1-content">
                    <div className="home-panel1-content-sub-menu">
                        <div className="home-panel1-content-sub-menu-list">
                            <div className="home-panel1-content-sub-menu-item-name">
                                <div>DANH SÁCH ĐÁNH GIÁ BÀI GIẢNG</div>
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

                            <div className="home-panel1-content-sub-menu-grid">
                                {subMenuData?.map((doc: any, index) => (
                                    <div
                                        key={index}
                                        className="home-panel1-content-sub-menu-item"
                                        onClick={() => navigate(`/sub-menu-5/detail-view/${doc?.id}`)}
                                    >
                                        <div
                                            className="home-panel1-content-sub-menu-item-content-grid"
                                            style={{
                                                borderBottom: index === subMenuData.length - 1 ? "none" : "1px solid black",
                                            }}
                                        >
                                            <img
                                                src={doc?.linkImage ?? "https://png.pngtree.com/png-vector/20190701/ourlarge/pngtree-document-icon-for-your-project-png-image_1533118.jpg"}
                                                alt={doc?.name}
                                                style={{ width: '100%', height: '100%' }} // Corrected inline styling
                                            />
                                            <div className="sub-menu-name">{doc?.name}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default SubMenu5List