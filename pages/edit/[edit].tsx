import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import { Breadcrumb, Layout, Card, Row, Col, Divider, Button, Typography, Input, message, Image } from "antd";
import { Select, } from 'antd';
import style from "../../styles/Home.module.css";
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { Form, Upload, } from 'antd';
import axios, { Axios } from 'axios';
import Navbar from '../component/navBar';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import axiosInstance from '../../utils/axios';
const { Header, Content, Footer } = Layout;
const { Text, Link } = Typography;
const { Search } = Input;
const { TextArea } = Input;
const { Dragger } = Upload;
const Post = () => {
  const router = useRouter()
  const { edit } = router.query
  //console.log(edit)
  const [img_product, setProductimg] = useState('');
  const [editimg, setEitimg] = useState(img_product)
  const [product_name, setProductname] = useState('');

  const [sub_id, setProductsub] = useState('');
  const [stock, setProductstock] = useState('');
  const [sku_id, setProductsku] = useState('');
  const [product_detail, setProductdetail] = useState('');
  const [product_price, setProductprice] = useState('');
  const [select, setSelect] = useState('');
  const [data, setData,] = useState([]);
  const [item, setitem,] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [subCateId, setSubcateId] = useState();
  //console.log(item)
  const [messageApi, contextHolder] = message.useMessage();
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

  }, [])
  function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
}
  const onFinish = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      sku_id: sku_id,
      subId: subCateId,
      product_name: product_name,
      product_detail: product_detail,
      img_product: item,
      stock: stock,
      product_price: product_price

    });
    console.log(raw)
    var requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(process.env.NEXT_PUBLIC_API_URL + "/product/" + edit, requestOptions)
      .then(response => response.text())
      //.then(result => console.log(result))
      .catch(error => console.log('error', error));
   
      messageApi.open({
        type: 'success',
        content: 'แก้ไขข้อมูลสำเร็จ',
      });
      await timeout(1000); 
    window.location.assign("/listProduct")
  }

  useEffect(() => {
    if (!edit) {
      return;
    }

    axiosInstance.get("/product/" + edit).then(function (response) { //แสดงข้อมูลในตาราง
      const datares = response.data;
      setProductname(datares.product_name)
      setProductimg(datares.img_product)
      setProductsub(datares.subCate.sub_category_name)
      setSubcateId(datares.subCate.id)
      setProductsku(datares.sku_id)
      setProductdetail(datares.product_detail)
      setProductstock(datares.stock)
      setProductprice(datares.product_price)
      setitem(datares.img_product)
      console.log(datares);
      setData(datares)
    });
  }, [edit]);

  // console.log(productname);
  const [size, setSize] = useState<SizeType>('large'); // default is 'middle'
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    action: process.env.NEXT_PUBLIC_API_URL + "/product/file",
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        console.log(info.file.response);
        setitem(info.file.response);
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        console.log(info.file)
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <Layout
      style={{ minHeight: "100vh", }}>
      <Navbar />
      {contextHolder}
      <Content style={{ padding: "0 20px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>แผงควบคุม</Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link href="/listProduct">
              {" "}
              <Text type="secondary">สินค้าและโปรโมชั่น</Text>{" "}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>แก้ไขสินค้าใหม่</Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          <Col flex="auto"> <h1 style={{ padding: '25px', marginTop: -20, marginLeft: -20, }}>แก้ไขสินค้าใหม่</h1></Col>
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

                <Input
                  style={{ width: "100%", marginTop: 15, }}
                  placeholder="ชื่อสินค้า"
                  size={size}
                  value={product_name}
                  onChange={(event) => {
                    setProductname(event.target.value)
                  }}
                  required
                />

              </Col>
            </Row>
            <Row>
              <Col span={4} offset={1}> <h3 style={{ marginTop: 20, }}>รูปสินค้า</h3></Col>
              <Col span={16}  >
                <Form.Item
                  name="file"
                >
                  <Dragger  {...props} style={{ marginTop: 20 }}>

                    <Image src={process.env.NEXT_PUBLIC_API_URL + "/product/picture/" + img_product} style={{ height: "200px", width: "100%" }} />
                    <br />
                    <br />
                    <Button type="dashed">แก้ไขรูปภาพ</Button>
                  </Dragger>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={4} offset={1}> <h3 style={{ marginTop: 20, }}>หมวดหมู่สินค้า</h3></Col>
              <Col span={16}>
                <Select placeholder="หมวดหมู่" size={size} onChange={setSubcateId} value={subCateId} className="Category" style={{ width: "100%", marginTop: 20 }}   >
                  {categoryData.map((data) => (
                    <Select.Option value={data.id} required >{data.sub_category_name}</Select.Option>)
                  )}
                </Select>
              </Col>
            </Row>
            <Row>
              <Col span={4} offset={1}>  <h3 style={{ marginTop: 40, }}>รหัสสินค้า</h3></Col>
              <Col span={16}>
                <Input
                  placeholder="รหัสสินค้า"
                  size={size}
                  value={sku_id}
                  onChange={(event) => {
                    setProductsku(event.target.value)
                  }}
                  style={{ marginTop: 20 }}
                  required
                />

              </Col>
            </Row>
            <Row>
              <Col span={4} offset={1}> <h3 style={{ marginTop: 40, }}>รายละเอียดสินค้า</h3></Col>
              <Col span={16}>
                <TextArea
                  size={size}
                  rows={4}
                  placeholder="ใส่รายละเอียดสินค้า"
                  value={product_detail}
                  onChange={(event) => {
                    setProductdetail(event.target.value)
                  }}
                  style={{ marginTop: 20 }}
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col span={4} offset={1}> <h3 style={{ marginTop: 40, }}>จำนวนสินค้า</h3></Col>
              <Col span={16}>
                <Input
                  placeholder="จำนวนสินค้า"
                  size={size}
                  type="number"
                  style={{ marginTop: 20 }}
                  value={stock}
                  onChange={(event) => {
                    setProductstock(event.target.value)
                  }}
                  required
                />

              </Col>
            </Row>
            <Row>
              <Col span={4} offset={1}> <h3 style={{ marginTop: 40, }}>ราคาสินค้า</h3></Col>
              <Col span={16}>
                <Input
                  placeholder="ราคาสินค้า"
                  size={size}
                  type="number"
                  style={{ marginTop: 20 }}
                  value={product_price}
                  onChange={(event) => {
                    setProductprice(event.target.value)
                  }}
                  required
                />

              </Col>
            </Row>
            <Row>
              <Col span={11}> </Col>
              <Col span={10}>
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
                      href="/listProduct" >
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

}

export default Post