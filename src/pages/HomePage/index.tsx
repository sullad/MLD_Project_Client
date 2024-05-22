import React from 'react'
import Layout from '../../components/Layout'
import Home from '../../components/Home'
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import "./style.css";
import "./slider.scss";

// import required modules
import { Pagination } from "swiper/modules";

import './styles.css';
import Question from '../../components/Home/question/Question';
const HomePage = () => {
    const pagination = {
        clickable: true,
        renderBullet: function (index: any, className: any) {
            return '<span class="' + className + '">' + "</span>";
        },
    };

    return (
        <Layout>
            <div className="slider">
                <Swiper
                    pagination={pagination}
                    modules={[Pagination]}
                    className="mySwiper slider-swiper"
                >
                    <SwiperSlide>
                        <div>
                            <img
                                className="mySlides"
                                src="https://cdn4t.mobiedu.vn/mooc4t/site_268/Image/c526210f-c722-4a46-9789-24652e19c44a.jpg"
                                style={{ width: "100%" }}
                                alt='banner'
                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div>
                            <img
                                className="mySlides"
                                src="https://tuyensinh.edu.vn/wp-content/uploads/2023/02/Elearning-def.webp"
                                style={{ width: "100%" }}
                                alt='banner'
                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div>
                            <img
                                className="mySlides"
                                src="https://cdn4t.mobiedu.vn/mooc4t/site_268/Image/c526210f-c722-4a46-9789-24652e19c44a.jpg"
                                style={{ width: "100%" }}
                                alt='banner'
                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div>
                            <img
                                className="mySlides"
                                src="https://tuyensinh.edu.vn/wp-content/uploads/2023/02/Elearning-def.webp"
                                style={{ width: "100%" }}
                                alt='banner'
                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div>
                            <img
                                className="mySlides"
                                src="https://cdn4t.mobiedu.vn/mooc4t/site_268/Image/c526210f-c722-4a46-9789-24652e19c44a.jpg"
                                style={{ width: "100%" }}
                                alt='banner'
                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div>
                            <img
                                className="mySlides"
                                src="https://tuyensinh.edu.vn/wp-content/uploads/2023/02/Elearning-def.webp"
                                style={{ width: "100%" }}
                                alt='banner'
                            />
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
            <Home />
            <Question />
        </Layout>
    )
}

export default HomePage