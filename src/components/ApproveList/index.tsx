import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import moment from 'moment';
import { TableHead } from '@mui/material';
import "./style.scss"
import { CheckCircleOutline, DoDisturb, TaskAltSharp } from '@mui/icons-material';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthenticationUser } from '../../features/user/userSlice';
import { useAppDispatch } from '../../hook/useTypedSelector';
import { User } from '../../models/User';
import { apiGetUser } from '../../api/user';
import { useAppSelector } from '../../hook/useTypedSelector';
import { authService } from '../../features/user/userService';
import { apiGetDoc } from '../../api/doc1';
import { Document1 } from '../../models/document1';
import { apiGetDoc2 } from '../../api/doc2';
import { Document2 } from '../../models/document2';
import { apiGetDoc3 } from '../../api/doc3';
import { Document3 } from '../../models/document3';



interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

const MyComponent = () => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleSelectOption = (option: string) => {
        setSelectedOption(option);
    };

    useEffect(() => {
        // Kiểm tra nếu selectedOption không phải là null và có giá trị là "1", "2", hoặc "3"
        if (selectedOption && ["1", "2", "3"].includes(selectedOption)) {
            fetchData(selectedOption); // Gọi hàm fetchData với selectedOption
        }
    }, [selectedOption]); // Chạy useEffect mỗi khi selectedOption thay đổi

    const fetchData = async (option: string) => {
        try {
            let result;
            if (option === "1") {
                result = await apiGetDoc(); // Gọi API để lấy dữ liệu từ Document1
            } else if (option === "2") {
                result = await apiGetDoc2(); // Gọi API để lấy dữ liệu từ Document2
            } else if (option === "3") {
                result = await apiGetDoc3(); // Gọi API để lấy dữ liệu từ Document3
            }

            if (result && result.data) {
                const documents: Document1[] = result.data; // Lấy dữ liệu từ kết quả trả về
                // Xử lý dữ liệu ở đây...
            } else {
                console.log("Không có dữ liệu trả về từ API");
            }
        } catch (error) {
            console.error("Lỗi khi gọi API: ", error);
        }
    };

    return (
        <div className="dropdown">
            {/* Button để mở dropdown */}
            <select className="dropbtn" onChange={(e) => handleSelectOption(e.target.value)}>
                <option value="" disabled selected hidden>Phụ Lục</option>
                <option value="1">Phụ Lục 1</option>
                <option value="2">Phụ Lục 2</option>
                <option value="3">Phụ Lục 3</option>
            </select>
        </div>
    );
}

function createData(id: number, creator: string, approver: string, date: Date, status: boolean) {
    return { id, creator, approver, date, status };
}

function createData2(id: number, creator: string, approver: string, date: Date) {
    return { id, creator, approver, date };
}

const rows1 = [
    createData(1, 'John', 'Alice', new Date(2024, 3, 1), true),
    createData(2, 'Alice', 'Bob', new Date(2024, 2, 28), false),
    createData(3, 'Emma', 'John', new Date(2024, 3, 2), true),
    createData(4, 'Bob', 'Emma', new Date(2024, 2, 30), true),
    createData(5, 'Sarah', 'Alice', new Date(2024, 2, 25), false),
    createData(6, 'Alice', 'John', new Date(2024, 3, 3), true),
].sort((a, b) => a.date.getTime() - b.date.getTime());

const rows2 = [
    createData2(1, 'John', 'Alice', new Date(2024, 3, 1)),
    createData2(2, 'Alice', 'Bob', new Date(2024, 2, 28)),
    createData2(3, 'Emma', 'John', new Date(2024, 3, 2)),
    createData2(4, 'Bob', 'Emma', new Date(2024, 2, 30)),
    createData2(5, 'Sarah', 'Alice', new Date(2024, 2, 25)),
    createData2(6, 'Alice', 'John', new Date(2024, 3, 3)),
].sort((a, b) => a.date.getTime() - b.date.getTime());

const ApproveList = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [isComplete, setIsCompleted] = React.useState(true)


    const emptyRows1 =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows1.length) : 0;


    const emptyRows2 =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows2.length) : 0;

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const [activeIndex, setActiveIndex] = React.useState(0);

    const navigate = useNavigate();
    const handleViewDetail = (row: any) => {
        navigate(`/sub-menu-1/detail-view/${row.id}`);
    };
    const handleRepairDetail = (row: any) => {
        navigate(`/sub-menu-1/detail-edit/${row.id}`);
    };

    const user = useAppSelector(state => state.auth.user)
    const [userRole, setuserRole] = React.useState();
    React.useEffect(() => {
        const fetchuserRole = async () => {
            if (user) {
                const res = await authService.checkAuthentication()

                if (res?.trim() !== "") {
                    const words = res.split(' ');
                    const email = words.find((word: string) => word.includes('@'));
                    const userId = words.pop();
                    const role = words.pop();
                    setuserRole(role);
                }
            }
        }
        fetchuserRole()
    }, [user])

    const [userInfo, setUserInfo] = useState<Document1[]>([]);
    useEffect(() => {
        const fetchAllUser = async () => {
            const res = await apiGetDoc();
            if (res && res.data) {
                const usersData: Document1[] = res.data;
                setUserInfo(usersData);
            }
        }
        fetchAllUser();

    }, [])

    const filteredUserInfo12 = userInfo.filter(row => row.isApprove === 1 || row.isApprove === 2);
    const filteredUserInfo34 = userInfo.filter(row => row.isApprove === 3 || row.isApprove === 4);
    const filteredUserInfo3 = userInfo.filter(row => row.isApprove === 3);
    const filteredUserInfo2 = userInfo.filter(row => row.isApprove === 2);
    const filteredUserInfo4 = userInfo.filter(row => row.isApprove === 4);


    return (
        <div>
            {userRole &&
                <div>
                    <div className="request-approve-switch">

                        {(userRole === "Leader" || userRole === "Teacher") && (
                            <Fragment>
                                <span onClick={() => setActiveIndex(0)} className={`incompleted-approve ${activeIndex === 0 ? "isClicked" : ""}`}>Danh sách chờ được duyệt</span>
                            </Fragment>)
                        }
                        {(userRole === "Leader" || userRole === "Teacher") && (
                            <Fragment>
                                <span onClick={() => setActiveIndex(1)} className={`completed-approve ${activeIndex === 1 ? "isClicked" : ""}`}>Danh sách đã chấp nhận</span>
                            </Fragment>)
                        }
                        {(userRole === "Leader" || userRole === "Teacher") && (
                            <Fragment>
                                <span onClick={() => setActiveIndex(2)} className={`completed-approve ${activeIndex === 2 ? "isClicked" : ""}`}>Danh sách bị từ chối</span>
                            </Fragment>)
                        }
                        {(userRole === "Leader" || userRole === "Principle") && (
                            <Fragment>
                                <span onClick={() => setActiveIndex(3)} className={`completed-approve ${activeIndex === 3 ? "isClicked" : ""}`}>Danh sách chưa duyệt</span>
                            </Fragment>)
                        }
                        {(userRole === "Leader" || userRole === "Principle") && (
                            <Fragment>
                                <span onClick={() => setActiveIndex(4)} className={`completed-approve ${activeIndex === 4 ? "isClicked" : ""}`}>Danh sách đã duyệt/từ chối</span>
                            </Fragment>)
                        }
                        <br />
                    </div>
                    <div>
                        {userRole && (
                            <div>
                                <div className="request-approve-switch">
                                </div>
                                <MyComponent />
                            </div>
                        )}
                    </div>
                </div>
            }
            {(userRole === "Leader" || userRole === "Teacher") && activeIndex === 0 && (<Fragment>
                <TableContainer component={Paper}>
                    <Table aria-label="custom pagination table">
                        <TableHead>
                            <TableRow sx={{ 'th': { border: 1 } }}>
                                <TableCell component="th" >
                                    Stt
                                </TableCell>
                                <TableCell component="th" >
                                    Ngày tạo
                                </TableCell>
                                <TableCell align="center">
                                    Trạng thái
                                </TableCell>
                                <TableCell align="center">

                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? filteredUserInfo12.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : filteredUserInfo12
                            ).map((row, index) => (
                                // (row.isApprove === 1 || row.isApprove === 2) &&
                                <TableRow key={row.id} sx={{ 'td': { border: 1 } }}>
                                    <TableCell >
                                        {(page * rowsPerPage) + index + 1}
                                    </TableCell>
                                    <TableCell >
                                        {row.createdDate}
                                    </TableCell>
                                    <TableCell align="center">
                                        {
                                            row.isApprove === 1 ? (
                                                <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", padding: "6px 12px", width: "130px", margin: "auto", cursor: 'pointer', color: 'green' }}>
                                                    Save draft
                                                </div>
                                            ) : (
                                                row.isApprove === 2 ? (
                                                    <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", padding: "6px 12px", width: "130px", margin: "auto", cursor: 'pointer', color: 'red' }}>
                                                        Waiting
                                                    </div>
                                                ) : null // Add more conditions for other values of isApprove if needed
                                            )
                                        }

                                    </TableCell>
                                    <TableCell align="center">
                                        <button className='py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left flex' key={row.id} onClick={() => handleViewDetail(row)} >
                                            <span>Xem chi tiết</span>
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {emptyRows1 > 0 && (
                                <TableRow style={{ height: 53 * emptyRows1 }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={rows1.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    slotProps={{
                                        select: {
                                            inputProps: {
                                                'aria-label': 'rows per page',
                                            },
                                            native: true,
                                        },
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Fragment>)
            }
            {(userRole === "Leader" || userRole === "Teacher") && activeIndex === 1 && <Fragment>
                <TableContainer component={Paper}>
                    <Table aria-label="custom pagination table">
                        <TableHead>
                            <TableRow sx={{ 'th': { border: 1 } }}>
                                <TableCell component="th" >
                                    Stt
                                </TableCell>
                                <TableCell component="th" >
                                    Người duyệt
                                </TableCell>
                                <TableCell align="center">
                                    Ngày tạo
                                </TableCell>
                                <TableCell align="center">
                                    Trạng thái
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? filteredUserInfo3.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : filteredUserInfo3
                            ).map((row, index) => (
                                // (row.isApprove === 3) &&
                                <TableRow key={row.id} sx={{ 'td': { border: 1 } }}>
                                    <TableCell >
                                        {(page * rowsPerPage) + index + 1}
                                    </TableCell>
                                    <TableCell >
                                        {row.userFullName}
                                    </TableCell>

                                    <TableCell align="center">
                                        {moment(row.createdDate).format('DD-MM-YYYY')}
                                    </TableCell>
                                    <TableCell align="center">
                                        {

                                            row.isApprove === 3 ? (
                                                <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", padding: "6px 12px", width: "130px", margin: "auto", cursor: 'pointer', color: 'red' }}>
                                                    Chấp nhận
                                                </div>
                                            ) : null

                                        }
                                        {/* {
                                            row.status ?
                                                <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", backgroundColor: "#99FFFF", padding: "6px 12px", width: "130px", margin: "auto", cursor: 'pointer' }}> <CheckCircleOutline /> Chấp nhận</div>
                                                : <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", backgroundColor: "#FF9999", padding: "6px 12px", width: "130px", margin: "auto", cursor: 'pointer' }}> <DoDisturb /> Từ chối</div>
                                        } */}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {emptyRows1 > 0 && (
                                <TableRow style={{ height: 53 * emptyRows1 }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={rows1.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    slotProps={{
                                        select: {
                                            inputProps: {
                                                'aria-label': 'rows per page',
                                            },
                                            native: true,
                                        },
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Fragment>
            }
            {(userRole === "Leader" || userRole === "Teacher") && activeIndex === 2 && <Fragment>
                <TableContainer component={Paper}>
                    <Table aria-label="custom pagination table">
                        <TableHead>
                            <TableRow sx={{ 'th': { border: 1 } }}>
                                <TableCell component="th" >
                                    Stt
                                </TableCell>
                                <TableCell component="th" >
                                    Người duyệt
                                </TableCell>
                                <TableCell align="center">
                                    Ngày tạo
                                </TableCell>
                                <TableCell align="center">
                                    Trạng thái
                                </TableCell>
                                <TableCell align="center">

                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? filteredUserInfo4.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : filteredUserInfo4
                            ).map((row, index) => (
                                <TableRow key={row.id} sx={{ 'td': { border: 1 } }}>
                                    <TableCell >
                                        {(page * rowsPerPage) + index + 1}
                                    </TableCell>
                                    <TableCell >
                                        {row.approveByName}
                                    </TableCell>
                                    <TableCell align="center">
                                        {moment(row.createdDate).format('DD-MM-YYYY')}
                                    </TableCell>
                                    <TableCell align="center">
                                        {
                                            row.isApprove === 4 ? (
                                                <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", padding: "6px 12px", width: "130px", margin: "auto", cursor: 'pointer', color: 'red' }}>
                                                    Từ chối
                                                </div>
                                            ) : null

                                        }
                                    </TableCell>
                                    <TableCell align="center">
                                        <button className='py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left flex' key={row.id} onClick={() => handleRepairDetail(row)} >
                                            <span>Sửa</span>
                                        </button>

                                    </TableCell>
                                </TableRow>
                            ))}
                            {emptyRows1 > 0 && (
                                <TableRow style={{ height: 53 * emptyRows1 }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={rows1.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    slotProps={{
                                        select: {
                                            inputProps: {
                                                'aria-label': 'rows per page',
                                            },
                                            native: true,
                                        },
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Fragment>
            }
            {(userRole === "Leader" || userRole === "Principle") && activeIndex === 3 && <Fragment>
                <TableContainer component={Paper}>
                    <Table aria-label="custom pagination table">
                        <TableHead>
                            <TableRow sx={{ 'th': { border: 1 } }}>
                                <TableCell component="th" >
                                    Stt
                                </TableCell>
                                <TableCell component="th" >
                                    Người tạo
                                </TableCell>
                                <TableCell align="center">
                                    Ngày tạo
                                </TableCell>
                                <TableCell align="center">
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? filteredUserInfo2.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : filteredUserInfo2
                            ).map((row, index) => (
                                <TableRow key={row.id} sx={{ 'td': { border: 1 } }}>
                                    <TableCell >
                                        {(page * rowsPerPage) + index + 1}
                                    </TableCell>
                                    <TableCell >
                                        {row.userFullName}
                                    </TableCell>

                                    <TableCell align="center">
                                        {moment(row.createdDate).format('DD-MM-YYYY')}
                                    </TableCell>
                                    <TableCell align="center">
                                        <button className='py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left flex' key={row.id} onClick={() => handleViewDetail(row)} >
                                            <span>Xem chi tiết</span>
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {emptyRows1 > 0 && (
                                <TableRow style={{ height: 53 * emptyRows1 }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={rows1.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    slotProps={{
                                        select: {
                                            inputProps: {
                                                'aria-label': 'rows per page',
                                            },
                                            native: true,
                                        },
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Fragment>
            }
            {(userRole === "Leader" || userRole === "Principle") && activeIndex === 4 && <Fragment>
                <TableContainer component={Paper}>
                    <Table aria-label="custom pagination table">
                        <TableHead>
                            <TableRow sx={{ 'th': { border: 1 } }}>
                                <TableCell component="th" >
                                    STT
                                </TableCell>
                                <TableCell component="th" >
                                    Người tạo
                                </TableCell>
                                <TableCell align="center">
                                    Ngày tạo
                                </TableCell>
                                <TableCell align="center">
                                    Trạng thái
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? filteredUserInfo34.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : filteredUserInfo34
                            ).map((row, index) => (
                                <TableRow key={row.id} sx={{ 'td': { border: 1 } }}>
                                    <TableCell >
                                        {(page * rowsPerPage) + index + 1}
                                    </TableCell>
                                    <TableCell>
                                        {row.userFullName}
                                    </TableCell>
                                    <TableCell align="center">
                                        {moment(row.createdDate).format('DD-MM-YYYY')}
                                    </TableCell>
                                    <TableCell align="center">
                                        {
                                            row.isApprove === 3 ? (
                                                <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", padding: "6px 12px", width: "130px", margin: "auto", cursor: 'pointer', color: 'green' }}>
                                                    Chấp nhận
                                                </div>
                                            ) : (
                                                row.isApprove === 4 ? (
                                                    <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", padding: "6px 12px", width: "130px", margin: "auto", cursor: 'pointer', color: 'red' }}>
                                                        Từ chối
                                                    </div>
                                                ) : null
                                            )
                                        }
                                        {/* {
                                            row.status ?
                                                <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", backgroundColor: "#99FFFF", padding: "6px 12px", width: "130px", margin: "auto", cursor: 'pointer' }}> <CheckCircleOutline /> Đã duyệt</div>
                                                : <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", backgroundColor: "#FF9999", padding: "6px 12px", width: "130px", margin: "auto", cursor: 'pointer' }}> <DoDisturb /> Từ chối</div>
                                        } */}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {emptyRows1 > 0 && (
                                <TableRow style={{ height: 53 * emptyRows1 }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={rows1.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    slotProps={{
                                        select: {
                                            inputProps: {
                                                'aria-label': 'rows per page',
                                            },
                                            native: true,
                                        },
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Fragment>
            }

        </div>
    );
}

export default ApproveList;