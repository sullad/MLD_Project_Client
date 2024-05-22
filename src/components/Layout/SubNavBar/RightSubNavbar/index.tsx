import { Grid } from "@mui/material";
import React from "react";

const RightSubNavBar = () => {
  return (
    <Grid item xs={2} style={{ padding: 0 }}>
      <div className="sub-nav-bar sub-nav-bar-right">
        <div className="sub-nav-bar-item">
          <div className="sub-nav-bar-item-name">Tin tức</div>
          <div className="sub-nav-bar-item-content">
            <p>
              Quốc tế: Hội nghị thượng đỉnh G20 đề cập đến các vấn đề môi
              trường.
            </p>
            <p>
              Địa phương: Lễ hội văn hóa truyền thống sẽ được tổ chức vào cuối
              tuần này.
            </p>
            <p>
              Công nghệ: Đột phá trong công nghệ pin mặt trời mới có thể lưu trữ
              năng lượng lâu hơn.
            </p>
            <p>
              Sức khỏe: Các chuyên gia khuyến nghị lối sống lành mạnh để phòng
              chống bệnh tật.
            </p>
            <p>Công nghệ AI mới giúp giải quyết ô nhiễm không khí.</p>
          </div>
        </div>
        <div className="sub-nav-bar-item">
          <div className="sub-nav-bar-item-name">Hỗ trợ</div>
          <div className="sub-nav-bar-item-content">
            <p>
              Cần hỗ trợ? Liên hệ chúng tôi qua email{" "}
              <a href="mailto:support@example.com">support@example.com</a>.
            </p>
            <p>FAQ: Cách đăng ký và sử dụng dịch vụ mới nhất.</p>
            <p>
              Tìm hiểu thêm về chính sách đổi trả và hoàn tiền của chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </Grid>
  );
};

export default RightSubNavBar;
