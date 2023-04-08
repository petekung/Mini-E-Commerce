import React from 'react';
import { Button, Result } from 'antd';

const paymentThank: React.FC = () => (
  <Result
    status="success"
    title="ขอบคุณสำหรับคำสั่งซื้อ"
    extra={[
      <Button style={{ marginTop: 0, width: "50%", background: "#523dce" }} href={"https://line.me/R/ti/p/@931tsnta"} type="primary" size={"large"} >
        ตกลง
      </Button>
    ]}

  />
);

export default paymentThank;