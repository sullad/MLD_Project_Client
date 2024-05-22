import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './style.scss'

const ScromType = () => {
    const subMenu = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const navigate = useNavigate()

    return (
        <div className='scrom-type-panel'>
            <div className='scrom-type-panel-content'>
                <div className="scrom-type-panel-content-sub-menu">
                    <div className="scrom-type-panel-content-sub-menu-list">
                        <div className="scrom-type-panel-content-sub-menu-item-name">
                            <div className='add-row-button'>
                                <Link to="/upload-bai-giang">Đưa eleaning lên</Link>
                            </div>
                        </div>
                        <div className='grade-name'>Violet</div>
                        <div className="scrom-type-panel-content-sub-menu-item-content-grid">
                            {
                                subMenu?.map((item, index) => (
                                    <div key={index} className='sub-menu-content-detail' onClick={() => navigate('/sub-menu-1/detail-view')}>

                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScromType