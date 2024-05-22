import React from "react";
import "./style.scss";
import { Contacts, LocalLibrary, Plagiarism } from "@mui/icons-material";

const Question = () => {
  return (
    <div>
      <div className="question-content ">
        <div className="header-content">
          <div className="main-header-content">
            <h2 style={{ marginBottom: "0" }}>VÌ SAO BẠN NÊN CHỌN</h2>
            <h2 style={{ color: "#FFB38E", fontWeight: "500" }}>
              E-LESSON.COM
            </h2>
          </div>
          <div className="sub-header-content">
            <span>Khám phá sức mạnh của kiến thức với e-lesson Management</span>
          </div>
        </div>
        <div className="question-list-content">
          <div className="question-item-content">
            <div className="icon-question">
              <LocalLibrary
                style={{ width: "70", height: "70", color: "#CD8D7A" }}
              />
            </div>
            <div className="question-title">
              Cách thức học tập như <br />
              thế nào trên e-lesson Management?
            </div>
            <div className="answer-title">
              Khóa học của chúng tôi cung cấp "Bài giảng chi tiết" để hỗ trợ bạn
              hiểu rõ về các chủ đề, cách học và áp dụng kiến thức.
            </div>
          </div>
          <div className="question-item-content">
            <div className="icon-question">
              <Plagiarism
                style={{ width: "70", height: "70", color: "#CD8D7A" }}
              />
            </div>
            <div className="question-title">
              Làm thế nào để tìm kiếm <br /> tài liệu học trên e-lesson
              Management?
            </div>
            <div className="answer-title">
              Đừng lo, trên e-lesson Management, bạn có thể truy cập "Thư viện
              Tài liệu" để tìm kiếm và tham khảo các tài liệu học phong phú và
              đa dạng.
            </div>
          </div>
          <div className="question-item-content">
            <div className="icon-question">
              <Contacts
                style={{ width: "70", height: "70", color: "#CD8D7A" }}
              />
            </div>
            <div className="question-title">
              Có cách nào để tương tác với giáo viên trên e-lesson Management
              không?
            </div>
            <div className="answer-title">
              Đương nhiên, chúng tôi cung cấp tính năng "Hỗ trợ" để giúp bạn có
              cơ hội gửi câu hỏi và nhận được phản hồi từ giáo viên.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
