
import React, { useState, useEffect } from 'react';
import { Breadcrumb, Layout, Card, Row, Col, Divider, Button, Typography, Input, message, Image } from "antd";
import { Select, } from 'antd';
import Navbar from "./component/navBar";
import style from "../styles/Home.module.css";
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { CloudUploadOutlined } from '@ant-design/icons';
import { Form, Upload } from 'antd';
import axios, { Axios } from 'axios';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import axiosInstance from '../utils/axios';
const { Header, Content, Footer } = Layout;
const { Text, Link } = Typography;
const { Search } = Input;
const { TextArea } = Input;
const { Dragger } = Upload;



const App_Product: React.FC = () => {

    const [product_name, setProductname] = useState('');
    const [img_product, setProductimg] = useState('');
    const [sub_id, setProductsub] = useState('');
    const [stock, setProductstock] = useState('');
    const [sku_id, setProductsku] = useState('');
    const [product_detail, setProductdetail] = useState('');
    const [product_price, setProductprice] = useState('');
    const [categoryData, setCategoryData] = useState([]);
    const onFinish = (values: any) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            sku_id: values.sku_id,
            subId: values.sub_id,
            product_name: values.product_name,
            product_detail: values.product_detail,
            img_product: img_product,
            stock: values.stock,
            product_price: values.product_price
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.NEXT_PUBLIC_API_URL+"/product", requestOptions)
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => console.log(error));
           window.location.assign("/listProduct")
    };



    const [size, setSize] = useState<SizeType>('large'); // default is 'middle'

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        action: process.env.NEXT_PUBLIC_API_URL+"/product/file",
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

            const { status } = info.file;
            if (status !== 'uploading') {
                //console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                setProductimg(info.file.response);
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    const cate = [];
    useEffect(() => {
        axiosInstance
            .get("/product/category/subcategory")  //ดูข้อมูล
            .then(function (response) {
                const dataCate = response.data;
              //  console.log(dataCate);
                for (const i of dataCate) {
                    cate.push(i)
                }
                setCategoryData(cate);
            });
        
    },[categoryData,setCategoryData])
    const preventMinus = (e) => {
        if (e.code === 'Minus') {
            e.preventDefault();
        }
    };

   ///=console.log(categoryData)
    return (

        <Layout
            style={{ minHeight: "100vh", }}>
            <Navbar />
            <Content style={{ padding: "0 20px" }}>
                <Breadcrumb style={{ margin: "16px 0" }}>
                    <Breadcrumb.Item>แผงควบคุม</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link href="/listProduct">
                            {" "}
                            <Text type="secondary">สินค้าและโปรโมชั่น</Text>{" "}
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>เพิ่มสินค้าใหม่</Breadcrumb.Item>
                </Breadcrumb>
                <Row>
                    <Col flex="auto"> <h1 style={{ padding: '25px', marginTop: -20, marginLeft: -20, }}>เพิ่มสินค้าใหม่</h1></Col>
                </Row>
                <Card className={style.right2} style={{ minHeight: "100vh", marginTop: -20, }} >
                    <h2 style={{ marginLeft: 20, }}>รายละเอียดสินค้า</h2>
                    <Divider style={{ marginTop: 10 }} />
                    <Form
                        name="wrap"
                        labelCol={{ flex: '110px' }}
                        labelAlign="left"
                        labelWrap
                        wrapperCol={{ flex: 1 }}
                        colon={false}
                        onFinish={onFinish}

                    >
                        <Row>
                            <Col span={4} offset={1}><h3 style={{ marginTop: 15, }}>ชื่อสินค้า</h3></Col>
                            <Col span={16}>
                                <Form.Item
                                    name="product_name"
                                    rules={[{ required: true, message: 'กรุณาใส่ชื่อสินค้าของคุณ' }]}
                                >
                                    <Input
                                        style={{ width: "100%", marginTop: 15, }}
                                        placeholder="ชื่อสินค้า"
                                        size={size}
                                        value={product_name}
                                       
                                        required
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4} offset={1}><h3 style={{ marginTop: 20, }}>รูปสินค้า</h3></Col>
                            <Col span={16}>
                                <Form.Item
                                    name="img_product"
                                    rules={[{ required: true, message: 'กรุณาใส่รูปภาพสินค้าของคุณ' }]}
                                >
                                    <Dragger {...props} style={{ marginTop: 20 }} multiple={false} maxCount={1} >
                                        <h1> <CloudUploadOutlined /></h1>
                                        <p className="ant-upload-hint">คลิกเพื่ออัปโหลด หรือ ลากรูปที่ต้องการใส่ในกรอบนี้</p>
                                        <p className="ant-upload-hint">PNG, JPG, GIF (ขนาดไม่เกิน 2 MB)</p>

                                    </Dragger> 

                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4} offset={1}><h3 style={{ marginTop: 20, }}>หมวดหมู่สินค้า</h3></Col>
                            <Col span={16}>
                                <Form.Item
                                    name="sub_id"
                                    rules={[{ required: true, message: 'กรุณาใส่หมวดหมู่สินค้าของคุณ' }]}
                                >
                                    <Select placeholder="หมวดหมู่" size={size} onChange={setProductsub} className="Category" style={{ width: "100%", marginTop: 20 }}   >
                                        {categoryData.map((data) => (
                                        <Select.Option value={data.id} required >{data.sub_category_name}</Select.Option>)
                                        )}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4} offset={1}> <h3 style={{ marginTop: 20, }}>รหัสสินค้า</h3></Col>
                            <Col span={16}>
                                <Form.Item
                                    name="sku_id"
                                    rules={[{ required: true, message: 'กรุณาใส่รหัสสินค้าของคุณ' }]}
                                >
                                    <Input
                                        placeholder="รหัสสินค้า"
                                        size={size}
                                        style={{ marginTop: 20 }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4} offset={1}>  <h3 style={{ marginTop: 20, }}>รายละเอียดสินค้า</h3></Col>
                            <Col span={16}>
                                <Form.Item
                                    name="product_detail"
                                    rules={[{ required: true, message: 'กรุณาใส่รายละเอียดสินค้าของคุณ' }]}
                                >
                                    <TextArea
                                        size={size}
                                        rows={4}
                                        placeholder="ใส่รายละเอียดสินค้า"
                                        style={{ marginTop: 20 }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4} offset={1}> <h3 style={{ marginTop: 20, }}>จำนวนสินค้า</h3></Col>
                            <Col span={16}>
                                <Form.Item
                                    name="stock"
                                    rules={[{ required: true, message: 'กรุณาใส่จำนวนสินค้าของคุณ' }]}
                                >
                                    <Input
                                        placeholder="จำนวนสินค้า"
                                        size={size}
                                        type="number"
                                        min={1}
                                        style={{ marginTop: 20 }}
                                     
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4} offset={1}> <h3 style={{ marginTop: 20, }}>ราคาสินค้า</h3></Col>
                            <Col span={16}>
                                <Form.Item
                                    name="product_price"
                                    rules={[{ required: true, message: 'กรุณาใส่ราคาสินค้าของคุณ' }]}
                                >
                                    <Input
                                        placeholder="ราคาสินค้า"
                                        size={size}
                                        type="number"
                                        style={{ marginTop: 20 }}
                                        min={1}
                                        onChange={(event) => {
                                            setProductprice(event.target.value)
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={11}></Col>
                            <Col span={11}>
                                <Row>
                                    <Col>
                                        <Button
                                            style={{ background: "#523dce", marginTop: 20, }}
                                            type="primary"
                                            size={size}
                                            htmlType="submit" >
                                            บันทึก
                                        </Button>
                                        &nbsp;
                                        <Link
                                            href="./listProduct" >
                                            <Button
                                                size={size} >
                                                ยกเลิก
                                            </Button>
                                        </Link>
                                    </Col>
                                </Row>

                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Content>
            <Footer style={{ textAlign: "center" }}>
                Ant Design ©2018 Created by Ant UED
            </Footer>
        </Layout>
    );
};

export default App_Product;