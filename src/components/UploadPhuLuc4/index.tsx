import React, { useEffect, useState } from 'react'
import './style.scss'
import generatePDF, { Options } from "react-to-pdf";
import { Subject } from '../../models/subject';
import { Class } from '../../models/class';
import { apiGetAllClass } from '../../api/class';
import { apiGetSubject } from '../../api/subject';
import { blob } from 'stream/consumers';
import axios from 'axios';
import { User } from "../../models/User";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Radio, RadioGroup, Select } from '@mui/material';
import { useAppSelector } from '../../hook/useTypedSelector';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { apiDeleteTeachingPlanner, apiGetTeachingPlannerById, apiPostTeachingPlanner } from '../../api/teachingPlanner';
import { apiGetSubMenu4ById, apiPostSubMenu4, apiUpdateSubMenu4 } from '../../api/subMenu4';
import { apiGetDoc3InformationByDoc3Id } from '../../api/subMenu3';
import { userInfo } from 'os';
import { apiGetListIdOfTeacherAndPricipleByDepartmentId, apiPostNotification } from '../../api/notification';
import { apiGetUser } from '../../api/user';

export const options: Options = {
    filename: "using-function.pdf",
    page: {
        margin: 20
    }
};
const UploadPhuLuc4 = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()
    const user = useAppSelector((state) => state.auth.user);
    const [userInfoLogin, setUserInfoLogin] = useState<User>();
    const [subjectId, setSubjectId] = useState<number | null>(null)
    const [classId, setClassId] = useState<number | null>(null)
    const [tieuDe, setTieuDe] = useState('')
    const [avatar, setAvatar] = useState<File | null>(null)
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [classes, setClasses] = useState<Class[]>([])
    const [avatarUrl, setAvatarUrl] = useState("https://png.pngtree.com/png-vector/20190701/ourlarge/pngtree-document-icon-for-your-project-png-image_1533118.jpg");

    const [fileUrl, setFileUrl] = useState('')
    const [open, setOpen] = useState(false);
    const [teachingPlannerId, setTeachingPlannerId] = useState(null);
    const [teachingPlanner, setTeachingPlanner] = useState<any>();
    const [document3Info, setDocument3Info] = useState<any>();
    const [document4Info, setDocument4Info] = useState<any>()
    const [topicOrLesson, setTopicOrLesson] = useState("lesson")
    const [principleAndTeacher, setPrincipleAndTeacher] = useState<any>();
    const isEditPath = location.pathname.includes('edit');

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
        const fecthPrincipleAndTeacher = async () => {
          if (userInfoLogin?.departmentId) {
            const res = await apiGetListIdOfTeacherAndPricipleByDepartmentId(
                userInfoLogin?.departmentId
            );
            if (res && res.data) {
              const resData: any = res.data;
              setPrincipleAndTeacher(resData);
            }
          }
        };
        fecthPrincipleAndTeacher()
      }, [userInfoLogin?.departmentId])

    useEffect(() => {
        if (location.pathname.includes("upload")) {
            const fetchGetDoc3InformationByDoc3Id = async () => {
                const res = await apiGetDoc3InformationByDoc3Id(location.pathname.split('/')[2])
                if (res && res.data) {
                    setDocument3Info(res.data);
                    
                }
            }
            fetchGetDoc3InformationByDoc3Id()
            setTeachingPlanner(document3Info?.document3Info)
        }
    }, [location.pathname])

    useEffect(() => {
        if (isEditPath) {
            const fecthDoc4 = async () => {
                const res = await apiGetSubMenu4ById(location.pathname.split('/')[3])
                if (res && res.data) {
                    setDocument4Info(res.data)
                }
            }
            fecthDoc4()
        }
    }, [location.pathname, isEditPath])

    useEffect(() => {
        if (document4Info) {
            const fecthTeachingPlanner = async () => {
                const res = await apiGetTeachingPlannerById(document4Info?.teachingPlannerId)
                if (res && res.data) {
                    setTeachingPlanner(res.data)
                }
            }
            fecthTeachingPlanner()
        }
        else setTeachingPlanner(document3Info?.document3Info);
    }, [document4Info,document3Info])

    const handleAvatarChange = async (e: any) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setAvatar(file);
            const blob = new Blob([file], { type: file.type });
            const formData = new FormData();
            formData.append('files', blob, file.name);
            const response = await axios.post('https://localhost:7241/api/S3FileUpload/upload?prefix=images%2F', formData);
            if (response?.status === 200)
                setAvatarUrl(response.data)
        }
    };

    const handleFileChange = async (e: any) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setAvatar(file);
            const blob = new Blob([file], { type: file.type });
            const formData = new FormData();
            formData.append('files', blob, file.name);
            const response = await axios.post('https://localhost:7241/api/S3FileUpload/upload?prefix=doc4%2F', formData);
            if (response?.status === 200)
                setFileUrl(response.data)
        }
    };

    useEffect(() => {
        const fetchClasses = async () => {
            const res = await apiGetAllClass();
            if (res && res.data) {
                const classData: Class[] = res.data;
                setClasses(classData);
            }
        }

        const fetchSubject = async () => {
            const res = await apiGetSubject();
            if (res && res.data) {
                const subjectData: Subject[] = res.data;
                setSubjects(subjectData);
            }
        }

        fetchClasses();
        fetchSubject();

    }, []);

    const handleTieuDeChange = (e: any) => {
        if (!isEditPath)
            setTieuDe(e.target.value);
    };

    const handleUpload = async () => {
        setOpen(true)
        console.log(teachingPlanner)
        if (teachingPlanner && user) {
            const post = await apiPostTeachingPlanner(null, { userId: user?.userId, subjectId: teachingPlanner?.subjectId, classId: teachingPlanner?.classId })
            if (post) {
                setTeachingPlannerId(post?.data.id)
            }
        }
    }

    const handleClose = async () => {
        setOpen(false)
        try {
            await apiDeleteTeachingPlanner(teachingPlannerId);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddDoc4 = async () => {
        if (!isEditPath) {
            if (teachingPlannerId && user && teachingPlanner && fileUrl && avatarUrl) {
                const post = await apiPostSubMenu4({ teachingPlannerId: teachingPlannerId, name: tieuDe, linkFile: fileUrl, linkImage: avatarUrl, isApprove : 2 })
                if (post) {
                    await apiPostNotification({
                        receiveBy: principleAndTeacher?.leader || [],
                        sentBy: user?.userId,
                        titleName: `KẾ HOẠCH BÀI DẠY : ${post.data.name.toUpperCase()} ĐÃ ĐƯỢC ĐĂNG TẢI, HÃY XÉT DUYỆT`,
                        message: `KẾ HOẠCH BÀI DẠY :${post.data.name.toUpperCase()} ĐÃ ĐƯỢC ĐĂNG TẢI, HÃY XÉT DUYỆT`,
                        docType: 4,
                        docId: post.data.id,
                      });
                    setOpen(false)
                    alert("Thành công")
                    navigate(`/sub-menu-4/detail-view/${post.data.id}`)
                }
            }
            else
                alert("Nhập đầy đủ thông tin!")
        }
        else {
            if (user && fileUrl && avatarUrl) {
                const post = await apiUpdateSubMenu4({ teachingPlannerId: document4Info?.teachingPlannerId, name: document4Info?.name, linkFile: fileUrl, linkImage: avatarUrl, id: location.pathname.split('/')[3], isApprove : 2 }, location.pathname.split('/')[3])
                console.log(post?.data.dataMap.name);
                if (post) {
                    await apiPostNotification({
                        receiveBy: principleAndTeacher?.leader || [],
                        sentBy: user?.userId,
                        titleName: `KẾ HOẠCH BÀI DẠY : ${post?.data?.dataMap?.name.toUpperCase()} ĐÃ ĐƯỢC CHỈNH SỬA, HÃY XÉT DUYỆT`,
                        message: `KẾ HOẠCH BÀI DẠY :${post?.data?.dataMap?.name.toUpperCase()} ĐÃ ĐƯỢC CHỈNH SỬA, HÃY XÉT DUYỆT`,
                        docType: 4,
                        docId: post?.data?.dataMap?.id,
                      });
                    setOpen(false)
                    alert("Thành công")
                    navigate(`/sub-menu-4/detail-view/${post.data.dataMap.id}`)
                }
            }
            else
                alert("Nhập đầy đủ thông tin!")
        }
    }

    console.log("teachingPlanner: ", teachingPlanner)

    return (
        <div className='scrom-upload-panel'>
            <div className='scrom-upload-panel-content' id='main-content'>
                <div>ĐĂNG TẢI KHUNG KẾ HOẠCH GIẢNG DẠY</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        Đưa vào thư viện: Gốc &gt; HD sử dụng phần mềm &gt; Violet
                    </div>
                </div>
                <div className='upload-row'>
                    <div className='upload-title'>
                        Môn học
                    </div>
                    <div className="upload-input">
                        <select id="subjects" style={{ width: "100%", height: "30px" }}
                            onChange={(e) => setSubjectId(parseInt(e.target.value))}
                            value={teachingPlanner?.subjectId ?? ""}
                            disabled={true}
                        >
                            <option value="" disabled>Chọn môn học</option>
                            {
                                subjects?.map((item) => (
                                    <option value={item?.id}>{item?.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className='upload-row'>
                    <div className='upload-title'>
                        Lớp
                    </div>
                    <div className="upload-input">
                        <select id="classes" style={{ width: "100%", height: "30px" }}
                            onChange={(e) => setClassId(parseInt(e.target.value))}
                            value={teachingPlanner?.classId ?? ""}
                            disabled={true}
                        >
                            <option value="" disabled>Chọn lớp</option>
                            {
                                classes?.map((item) => (
                                    <option value={item?.id}>{item?.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                {

                    location.pathname.includes("upload") ? (params?.doc1Id && <div className='upload-row'>
                        <div className='upload-title'>
                            <select
                                onChange={(e) => {
                                    setTopicOrLesson(e.target.value)
                                }}
                                value={topicOrLesson}
                            >
                                <option value="lesson" label="Bài giảng" />
                                <option value="topic" label="Chuyên đề" />
                            </select>
                        </div>
                        <div className="upload-input">
                            <div>
                                {
                                    topicOrLesson === "lesson" ? (
                                        <select onChange={handleTieuDeChange}>
                                            <option value="" disabled>Chọn bài giảng</option>
                                            {
                                                document3Info?.curriculumNames?.map((topic: any, index: number) => (
                                                    <option value={topic} key={index}>{topic}</option>
                                                ))
                                            }
                                        </select>
                                    ) : (
                                        <select onChange={handleTieuDeChange}>
                                            <option value="" disabled>Chọn chuyên đề</option>
                                            {
                                                document3Info?.selectedTopicsNames?.map((name: any, index: number) => (
                                                    <option value={name} key={index}>{name}</option>
                                                ))
                                            }
                                        </select>
                                    )
                                }
                            </div>
                        </div>
                    </div>) : (
                        <div className='upload-row'>
                            <div className='upload-title'>
                                Tên bài dạy
                            </div>
                            <div className="upload-input">
                                {document4Info?.name}
                            </div>
                        </div>
                    )}

                {/* <div className='upload-row'>
                    <div className='upload-title'>
                        Chuyên đề
                    </div>
                    <div className="upload-input">
                        <input type="text" value={document4Info?.name} disabled={!isTopic} onChange={handleTieuDeChange} />
                    </div>
                </div> */}
                <div className='upload-row'>
                    <div className='upload-title'>
                        File dữ liệu
                    </div>
                    <div className="upload-input-file">
                        <input type="file" onChange={handleFileChange} accept='application/pdf' />
                    </div>
                </div>
                <div className='upload-row'>
                    <div className='upload-title'>
                        Ảnh đại diện
                    </div>
                    <div className="upload-input-file">
                        <input type="file" onChange={handleAvatarChange} accept='image/*' />
                    </div>
                </div>
                <div className='upload-tutorial'>
                    <div><strong>Các thầy cô đọc kỹ những chú ý sau để gửi lên e-learning thành công:</strong></div>
                    <ul>
                        <li>Nhấn nút <strong>Browse</strong> để chọn file e-learning đưa lên.</li>
                        <ul>
                            <li>Bài giảng được soạn bằng các phần mềm hỗ trợ.......</li>
                            <li>Bài giảng nên được .......</li>
                        </ul>
                        <li>Chọn ảnh đại diện........</li>
                        <li>Nhấn nút <strong>Lưu lại</strong>, bài giảng sẽ....</li>
                    </ul>
                </div>
                <div className='upload-button' onClick={handleUpload}>Lưu lại</div>
            </div>
            <Dialog
                open={open}
                onClose={async (event, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        handleClose();
                    }
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"

            >
                <DialogTitle id="alert-dialog-title" style={{ textAlign: "center", fontWeight: 600 }}>
                    Bạn có chắc chắn không
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" style={{ textAlign: "center", fontWeight: 600 }}>
                        Bạn có chắc muốn đưa phụ lục này vào xét duyệt
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} style={{ color: "#000", fontWeight: 600 }} >Hủy bỏ</Button>
                    <Button onClick={handleAddDoc4} className='button-mui' autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    )
}

export default UploadPhuLuc4