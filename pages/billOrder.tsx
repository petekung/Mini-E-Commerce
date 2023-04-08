
import React, { Component, useContext, useEffect, useState } from 'react';
import { Layout, Card, Row, Col, Button, Input, Select, Image, InputNumber, Alert, message } from 'antd';
import styles from '../styles/Home.module.css'
import Head from './component/headerLogo'
import axios from 'axios';
import { useRouter } from 'next/router';
import OrderContext from './orderContext';
import NavBar from './component/navBar';
import axiosInstance from '../utils/axios';
const { Header, Content, Footer } = Layout;

const billOrder : React.FC = () => {
    const router = useRouter()
    const { id } = router.query
    const [value, setValue] = useState("");
    const [data, setData] = useState([]);
    const [uuid, setUuid] = useState()
    const [total, setTotal] = useState(0);
    const [idShow, setIdShow] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
 
    const handleCopy = () => {
       try {
        navigator.clipboard.writeText(process.env.NEXT_PUBLIC_FN_URL+"/paymentView/?uuid=" + uuid).catch(err => {
          console.error('Error on server: ', err);
        });
      } catch (err) {
        console.error('Error on client: ', err);
      }
        // navigator.clipboard.writeText(process.env.NEXT_PUBLIC_FN_URL+"/paymentView/?uuid=" + uuid);
        messageApi.info('คัดลอกแล้ว');
    }
    var showData = [];
    useEffect(() => {
        axiosInstance
            .get("/order_list/"+ id) //pid ไอดี
            .then(function (response) {
                let data = response.data;
                console.log(data);
                const orderList = data.orderList;
                for (const i in orderList) {
                    showData.push(orderList[i])
                }
                setIdShow(id)
                setData(showData)
                setUuid(data.uuid)
                setTotal(data.total_price)
            });
    }, [id]);

    console.log(id);
    return (
        <Layout id={styles.navbarNewOrder}>
            <NavBar/>
            <Header id={styles.navbarNewOrder}>
                <Row>
                    <h1>ออเดอร์&nbsp;</h1>
                    <h1>A#{id}</h1> {/*อ้างอิงออเดอร์จากฐานข้อมูล*/}
                </Row>
            </Header>
            <Content>
                <br />
                <Card >
                    <Row>
                        <Col span={18} offset={0}>
                            <p>รายการที่สั่งซื้อ</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <div>
                                {data.map((data) => (
                                    <Row>
                                        <Col >
                                            <Image src={process.env.NEXT_PUBLIC_API_URL+"/product/picture/" + data.products.img_product} alt="product" width={"100px"} />
                                        </Col>
                                        <Col id={styles.floatRightOne} span={19} >
                                            <p>{data.products.product_name}</p>

                                            <br />
                                        </Col>
                                        <Col id={styles.floatRightOne} span={3}  >
                                            <p id={styles.deliveryPurple}> {data.products.product_price} THB</p>
                                            <InputNumber  size="small" defaultValue={data.quantiy+ "  ชิ้น"} readOnly />
                                        </Col>
                                    </Row>
                                ))}
                            </div>
                        </Col>
                    </Row>
                    <br />
                    <Row  style={{}}>
                        <Col span={21}>
                            <h4>ค่าจัดส่ง</h4>
                        </Col>
                        <Col lg={{ span: 3}}>
                            <h4>40 THB</h4> {/*เอามาจาก ค่าจัดส่ง */}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={21}>
                            <h4>ยอดที่ต้องชำระ</h4>
                        </Col>
                        <Col span={3} >
                            <h4 id={styles.sizeCharacter}>{total} THB</h4> {/*เอามาจาก ราคารวมสินค้า+ส่วนลด+ค่าจัดส่ง*/}
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
            <Footer id={styles.footerFixed}>
                <p>ลิงค์สำหรับส่งให้ลูกค้าแจ้งโอน</p>
                <Row >
                    <Col span={24}>
                        <Row>
                            <Col span={16} >
                                <Input value={process.env.NEXT_PUBLIC_FN_URL+"/paymentView/?uuid=" + uuid} onChange={(e) => setValue(e.target.value)} size="large" readOnly />
                            </Col>
                            <Col span={7} offset={1}>
                            {contextHolder}
                                <Button id={styles.buttonCopy} onClick={handleCopy} type={"primary"} block size={"large"} >
                                    คัดลอก
                                </Button>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col span={24} >
                                <Button id={styles.buttonCopy} href="./order_management" type={"primary"} block size={"large"} >
                                    ย้อนกลับ
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Footer>
        </Layout>
    )
}

export default billOrder;