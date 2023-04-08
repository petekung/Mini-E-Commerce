
import React, { useContext, useEffect, useState, } from 'react';
import { Layout, Row, Col, Card, Divider, Image, Badge, Button, Avatar, Typography } from 'antd';
import style from "../styles/Home.module.css";
import { ShoppingCartOutlined, ImportOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import router, { useRouter } from 'next/router';
import axios, { Axios } from 'axios';
import OrderContext from './orderContext';
import { NextPage } from 'next';

import axiosInstance from '../utils/axios';
import UserContext from './userContext';


const { Content, } = Layout;
const ButtonGroup = Button.Group;
const { Link } = Typography;
interface DataType {
    key: React.Key;
    id: number;
    product_mane: string;
    img_product: string;
    product_price: number
}

const CustomerByOrder: NextPage = () => {
    const router = useRouter();
    const Id = router.query.Id
    const UserId = router.query.UID
    const [size, setSize] = useState<SizeType>('large');
    const [quanity, setQuantity] = useState(1);
    const [data, setData] = useState();
    const [dataShow, setDataShow] = useState([]);
    const { carts, setCarts } = useContext(OrderContext)
    const { userId , setUserId} = useContext(UserContext)
  //  console.log(userId)
   useEffect(() =>{
    console.log(userId)
   },[userId])
    var dataArray = [];
    const getProduct = () => {
        axiosInstance
            .get("/product/" + Id)  //ดูข้อมูล
            .then(function (response) {
                const dataView = response.data;
         //       console.log(dataView)
                setData(dataView);
                dataArray.push(dataView)
                setDataShow(dataArray)
            });
    }
    useEffect(() =>{
        if(UserId === undefined) return;
        setUserId(UserId)
    },[UserId])
    useEffect(() => {
        if(Id === undefined) return
        getProduct()
    })
    const declineBadge = () => {
        let newBadgeCount = quanity - 1;
        if (newBadgeCount < 0) {
            newBadgeCount = 0;
        }
        setQuantity(newBadgeCount);
    };

    const increaseBadge = () => {
        setQuantity(quanity + 1);
    };
    function goBack (){
        this.goBack();
    }

    function sumOrder() {

        setCarts([...carts, { ...data, quanity }])
        router.push({
            pathname: "./sumOrderByCustomer"
        })
    }
    function addToCart() {
        setCarts([...carts, { ...data, quanity }])
        console.log(carts)
    }
    function sendAddToCart() {
        router.push({
            pathname: "./addToCart"
        })
    }
  //  console.log(carts)
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
                    <Row style={{ marginTop: -25 }}>
                        <Col span={1} style={{ marginTop: -15 }}> </Col>
                        <Col span={15} offset={6}><h3 >รายละเอียดสินค้า</h3></Col>
                        <Col span={1} style={{ marginTop: 15, }}>
                            <Link onClick={() => sendAddToCart()} >
                                <Badge count={carts.length}  >
                                    <Avatar shape="square" icon={<ShoppingCartOutlined style={{ color: "#000000" }} />} style={{ backgroundColor: "#E8E8E8 " }} />
                                </Badge>
                            </Link>
                        </Col>
                    </Row>
                    <Divider style={{ marginTop: -5 }} />
                    {dataShow.map((data) => (
                        <Row>
                            <Col>
                                <Row >
                                    <Col span={14} offset={6}>
                                        <Image src={process.env.NEXT_PUBLIC_API_URL+"/product/picture/" + data.img_product} />
                                    </Col>
                                </Row>
                                <Row >
                                    <Col span={24}>
                                        <h3>{data.product_name}</h3>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: -20 }} >
                                    <Col span={14}>
                                        <h3 style={{ color: '#A9A9A9' }}>{data.subCate.sub_category_name}</h3>
                                    </Col>
                                    <Col span={10} >
                                        <h3 >{data.product_price}THB</h3>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: -15 }}>
                                    <Col span={24}>
                                        <p>
                                            {data.product_detail}
                                        </p>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    ))}

                    <Row style={{ marginTop: 10 }} >
                        <Col span={7} ></Col>
                        <Col span={11}  >
                            <ButtonGroup>
                                <Button onClick={declineBadge} size={size}>
                                    <MinusOutlined />
                                </Button>
                                <Button size={size} style={{ width: "50px", }} >
                                    <Badge count={quanity} style={{ width: "30px", height: "30px", background: "#ffffff", color: "#000000", marginTop: -4, fontSize: "15px" }}  > </Badge>
                                </Button>
                                <Button onClick={increaseBadge} size={size}>
                                    <PlusOutlined />
                                </Button>
                            </ButtonGroup>
                        </Col>
                        <Col span={7} ></Col>
                    </Row>
                    <Row style={{ marginTop: 25 }}>
                        <Col span={1} ></Col>
                        <Col span={10} >
                            <Button style={{ marginTop: 0, width: "100%", }} onClick={() => sumOrder()} size={size}  >
                                ซื้อสินค้า
                            </Button>
                        </Col>
                        <Col span={2} ></Col>
                        <Col span={10}>
                            <Button onClick={() => addToCart()} style={{ marginTop: 0, width: "100%", background: "#523dce" }} type="primary" size={size} >
                                เพิ่มเข้าตระกร้า
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </Content>
        </Layout>
    );
};

export default CustomerByOrder;