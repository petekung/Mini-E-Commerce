
import React, { useState, useRef, useEffect } from 'react';
import { Layout, Card, Button, Result } from 'antd';
import style from "../styles/Home.module.css";
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import axios from 'axios';
import { useRouter } from 'next/router';




const { Content, Header } = Layout;
const ButtonGroup = Button.Group;

const SuccessFullyOrder = () => {
    const router = useRouter()
    const sentRes = router.query.id
    const [size, setSize] = useState<SizeType>('large');
    const [sentId, setSentId] = useState(null)

    useEffect(() => {
        setSentId(sentRes);
    }, [sentId, setSentId])
    useEffect(() => {
        if (sentId === null) return
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + "/push/" + sentId) //pid ไอดี
            .then(function (response) {
                console.log(response)
            });

      
        window.open('', '_self');
        window.close();
    }, [sentId])

 
    return (
        <Layout style={{ minHeight: "100vh", }}>
            <Content
                style={{
                    minHeight: "40vh",
                    marginRight: "1%",
                    marginLeft: "1%",
                    marginBottom: "1%",
                    marginTop: "1%",
                    height: "100",
                }}
            >
                <Card className={style.right2} style={{ minHeight: "100vh", marginTop: 0, }} >
                    <Result
                        status="success"
                        title="ทำการสั่งซื้อเรียบร้อย"
                        subTitle="ทางร้านค้าได้รับข้อมูล การสั่งซื้อเรียบร้อย"
                        extra={[
                            <Button style={{ marginTop: 0, width: "50%", background: "#523dce" }} href={"https://line.me/R/ti/p/@931tsnta"} type="primary" size={size} >
                                ตกลง
                            </Button>
                            ,
                        ]}
                    />

                </Card>
            </Content>
        </Layout>
    );
};

export default SuccessFullyOrder;