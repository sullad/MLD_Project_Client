import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiGetDoc3ByDoc1Id } from '../../api/subMenu3'
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'



function SubMenu3List() {
    const location = useLocation()
    const navigate = useNavigate()
    const [subMenuData, setSubMenuData] = useState<Document[]>([])
    const [age, setAge] = React.useState("");

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };
    useEffect(() => {
        const fetchSubMenu3 = async () => {
            const data = await apiGetDoc3ByDoc1Id(parseInt(location.pathname.split("/")[3]))
            if (data && data.data) {
                setSubMenuData(data.data)
            }
        }
        fetchSubMenu3()
    }, [location.pathname])
    console.log("subMenuData: ", subMenuData)
    return (
        <Layout>
            <div className="home-panel" style={{ minWidth: "20rem" }}>
                <div className="home-panel1-content">
                    <div className="home-panel1-content-sub-menu">
                        <div className="home-panel1-content-sub-menu-list">
                            <div className="home-panel1-content-sub-menu-item-name">
                                <div>KẾ HOẠCH GIÁO DỤC CỦA GIÁO VIÊN</div>
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
                                {
                                    subMenuData?.map((doc: any, index) => (
                                        <div key={index}>
                                            <div
                                                className="home-panel1-content-sub-menu-item-content-grid"
                                                style={{
                                                    borderBottom:
                                                        index === subMenuData.length - 1
                                                            ? "none"
                                                            : "1px solid black",
                                                }}
                                            >
                                                <div
                                                    className="sub-menu-content-detail"
                                                    onClick={() =>
                                                        navigate(`/sub-menu-3/detail-view/${doc?.id}`)
                                                    }
                                                >
                                                    <img
                                                        src={doc?.linkImage ?? "https://png.pngtree.com/png-vector/20190701/ourlarge/pngtree-document-icon-for-your-project-png-image_1533118.jpg"}
                                                        alt={doc?.name}
                                                        className="sub-menu-image"
                                                        style={{ width: '100%', height: '100%'}} // Adjust styling as needed
                                                    />
                                                </div>
                                                <div className="sub-menu-name">{doc?.name}</div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default SubMenu3List

