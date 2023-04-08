import { Image } from 'antd';
import React, { Component, useEffect, useState } from 'react';
import { Layout, Card, Row, Col, Button, Input } from 'antd';
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import axios from 'axios';
import { useRouter } from 'next/router'
const { Header, Content, Footer } = Layout;

export default function paymentView() {
    const router = useRouter()
    const { uuid } = router.query
    const [Data, setData] = useState([]);
    const [userId , setUserId] = useState();
    const [sumPrice, setsumPrice] = useState();
    const [orderId, setorderId] = useState();
    const [imgBill, setImgBill] = useState();
    const [ total , setTotal] = useState(0);
    const [id ,setId] = useState();
    const DataArray = [];
    useEffect(()=>{
        setUserId(uuid)
    },[uuid])
    useEffect(() => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL+"/payment/bill/"+userId ) //pid ไอดี
            .then(function (response) {
                let data = response.data;
                let order_list = data;
                console.log(order_list)
                for(const i in data.orderList){
                    DataArray.push(data.orderList[i])
                }
                setData(DataArray)
                setTotal(order_list.total_price)
                setId(order_list.id)
            });
    }, [userId]); 
    console.log(Data)
    const uploadBill = () =>{
        router.push({
            pathname:"/paymentBill",
            query:{
                uuid:uuid
            }
        })
    }
    return (
        <Layout id={styles.navbarNewOrder}>
            <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }} id={styles.navbar} >

                <p style={{ color: "white" }} >ออร์เดอร์ #A0{id} </p>

            </Header>
            <Content>
                <br />
                <Card >

                    <Row>
                        <Col span={18} offset={0}>
                            <p>รายการที่สั่งซื้อ</p>
                        </Col>

                    </Row>
                    {Data.map((item) => (
                        <Row>
                            <Col span={4} ><Image src={process.env.NEXT_PUBLIC_API_URL + "/payment/" + item.products.img_product}>
                            </Image> </Col>
                            <Col span={14} offset={1}>
                                <p> {item.products.product_name} </p>
                            </Col>
                            <Col lg={{ span: 2, offset: 3 }}>
                                <p>฿  {(item.products.product_price * item.quantiy)}</p>
                            </Col>
                        </Row>)
                    )}
                    <Row>
                        <Col span={18} offset={0}>
                            <p>ค่าจัดส่ง</p>
                            <p id={styles.characterText}>ไปรษณีย์ไทย&nbsp;ลงทะเบียน</p>
                        </Col>
                        <Col lg={{ span: 2, offset: 4 }}>
                            <p>฿40</p> {/*เอามาจาก ค่าจัดส่ง */}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={18} offset={0}>
                            <p>ยอดที่ต้องชำระ</p>
                        </Col>
                        <Col lg={{ span: 1, offset: 4 }}>
                            <p id={styles.sizeCharacter}>฿{total}</p> {/*เอามาจาก ราคารวมสินค้า+ส่วนลด+ค่าจัดส่ง*/}
                        </Col>
                    </Row>
                </Card>

                <br />
                <Card >
                    <Row>
                        <Col span={18} offset={0}>
                            <p>ช่องทางการโอน</p>
                        </Col>


                    </Row>
                    <Row>
                        <Col span={4} >
                            <Image src="logobank.png" width={80} height={80} />
                        </Col>
                        <Col span={10} offset={3} >
                            <Row>ธนาคารกสิกรไทย</Row>
                            <Row>048-2-08528-0</Row>
                            <Row>พนิดา จารุสาธิต</Row>
                        </Col>
                        <Col lg={{ span: 2, offset: 4 }} >
                            <Image src="QR.png" style={{ float: "right" }} width={80} height={80} />

                        </Col>
                    </Row>
                </Card>
            </Content>
            <br />
            <Footer id={styles.footerPayment}>
                <div>
                    <Row >
                        <Col span={24} >
                            
                                <Button type="primary" onClick={()=>uploadBill()} style={{ textAlign: "center", backgroundColor: "#5238ef", width: "100vn" }} size={"large"} block>แจ้งโอนและกรอกข้อมูลจัดส่ง</Button>

                          
                        </Col>
                    </Row>
                </div>

            </Footer>
        </Layout>
    )
}

