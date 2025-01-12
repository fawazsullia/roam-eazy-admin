import React from 'react';
import { Spin } from 'antd';
import Styles from './FullPageSpin.module.css';

const FullPageSpin = () => {
    return (
        <div className={Styles.fullPageSpin}>
            <Spin size="large" />
        </div>
    );
};

export default FullPageSpin;