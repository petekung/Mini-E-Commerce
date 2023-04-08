
import React, { Component, useEffect, useState } from 'react';
import { Layout, Card, Row, Col, Button, Input, InputNumber } from 'antd';
import styles from '../styles/Home.module.css'
import Head from './component/headerLogo';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { LoadingOutlined, PlusOutlined, InboxOutlined } from '@ant-design/icons';
import { message, Upload, Form, Image } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { redirect } from 'next/dist/server/api-utils';
import { encode } from 'punycode';
import { useRouter } from 'next/router';
import axios from 'axios';
const { Header, Content, Footer } = Layout;
const { TextArea } = Input;

const view = () => {
    const router = useRouter()
    const { uuid } = router.query
    const [imgBill, setImgBill] = useState();
    const [messageApi, contextHolder] = message.useMessage();
    const { Dragger } = Upload;
    const [id, setId] = useState();
    const [userId, setUserId] = useState();
    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'บันทึกข้อมูลสำเร็จ',
        });
    };
    useEffect(() => {
        setUserId(uuid)
    }, [uuid])
    // console.log(uuid)
    const props: UploadProps = { //validate file size and file type image only for antDesinge
        name: 'file',
        multiple: false,
        action: process.env.NEXT_PUBLIC_API_URL + "/payment/file",
        accept: 'image/*',
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('You can only upload image file!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Image must smaller than 2MB!');
            }
            return isImage && isLt2M;
        },

        onChange(info) {

            console.log(info);
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                setImgBill(info.file.response);
                if (imgBill == undefined) {

                } else {


                }
                message.success(`${info.file.name} file uploaded successfully.`);

            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },

    };
    var showData = [];
    useEffect(() => {

        axios
            .get(process.env.NEXT_PUBLIC_API_URL + "/payment/bill/" + userId)
            .then(function (response) {
                let data = response.data;
                console.log(data);
                const orderList = data.orderList;
                for (const i in orderList) {
                    showData.push(orderList[i])
                }
                console.log(data)
                setId(data.id)

            });
    }, [userId]);

    const onFinish = (values: any) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        // console.log(values);
        var raw = JSON.stringify({
            "img_bill": imgBill,
            "tel": values.tel,
            "email": values.email,
            "customer_fname": values.customer_fname,
            "customer_lname": values.customer_lname,
            "address": values.address,
        });
        var requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.NEXT_PUBLIC_API_URL+"/payment/"+ id, requestOptions)
            .then(response => response.text())
            .then(result =>
                router.push({
                    pathname: "/paymentThank"
                })
            )
            .catch(error => console.log('error', error))

    };
    const onNumber = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log('Change:', e.target.value);
    };

    return (
        <Layout id={styles.navbarNewOrder}>
            <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }} id={styles.navbar} >
                <p style={{ color: "white" }} >ออร์เดอร์ #A{id}</p>
            </Header>
            <Form name="basic" initialValues={{ remember: true }} onFinish={onFinish}
            >
                <Content>

                    <Row>
                        <Col span={24} offset={1} >
                            <p>ข้อมูลการโอน</p>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={22} offset={1} >
                            <div>
                                <Form.Item name="img_bill"
                                    rules={[{ required: true, message: 'Please input your Bill' }]}>
                                    <Dragger {...props} maxCount={1}  >
                                        <div id='iframeImg'><Image src={process.env.NEXT_PUBLIC_API_URL + "/payment/" + imgBill}></Image></div>
                                        <p className='ant-upload-drag-icon'><UploadOutlined /></p>
                                        <Button type="dashed" style={{ color: "##5238ef" }} >
                                            อัพโหลดสลิป
                                        </Button>
                                    </Dragger>
                                </Form.Item>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} offset={1} >
                            <p>ข้อมูลผู้สั่งซื้อ</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22} offset={1}>
                            <label htmlFor="">เบอร์มือถือ</label>
                            <Form.Item
                                name="tel"

                                rules={[{ required: true, message: 'Please input your Mobile Number!' }, { pattern: new RegExp(/^[0-9]*$/), message: "กรุณากรอกข้อมูลให้ถูกต้อง" }]}
                            >
                                <Input size="large" maxLength={10} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22} offset={1}>
                            <label htmlFor="">อีเมล์</label>
                            <Form.Item
                                name="email"
                                rules={[{ type: 'email', message: "Please input your email!", required: true }, { pattern: new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), message: "กรุณากรอกข้อมูลให้ถูกต้อง" }]}
                            >
                                <Input size="large" />
                            </Form.Item>

                        </Col>
                    </Row>

                    <Row>
                        <Col span={22} offset={1}>
                            <label htmlFor="">ชื่อ</label>
                            <Form.Item
                                name="customer_fname"
                                rules={[{ required: true, message: 'Please input your FirstName!' }, { pattern: new RegExp(/^[ก-๙A-Za-z\s]+$/), message: "กรุณากรอกชื่อภาษาไทยหรือภาษาอังกฤษเท่านั้น!" }]}
                            >
                                <Input size="large" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22} offset={1}>
                            <label htmlFor="">นามสกุล</label>
                            <Form.Item
                                name="customer_lname"
                                rules={[{ required: true, message: 'Please input your LastName!' }, { pattern: new RegExp(/^[ก-๙A-Za-z\s]+$/), message: "กรุณากรอกชื่อภาษาไทยหรือภาษาอังกฤษเท่านั้น!" }]}
                            >
                                <Input size="large" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22} offset={1}>
                            <label htmlFor="">ที่อยู่สำหรับจัดส่ง</label>
                            <Form.Item
                                name="address"
                                rules={[{ required: true, message: 'Please input your Address!' }]}
                            >
                                <TextArea rows={4} />

                            </Form.Item>
                        </Col>
                    </Row>
                </Content>
                <br />
                <Footer id={styles.footerPayment}>
                    <div>
                        <Row >
                            <Col span={24} >
                                <Button type="primary" htmlType="submit" style={{ textAlign: "center", backgroundColor: "#5238ef", width: "100vn" }} size={"large"} block>บันทึกข้อมูล</Button>
                            </Col>
                        </Row>
                    </div>
                </Footer>
            </Form>
        </Layout>
    )
}

export default view;