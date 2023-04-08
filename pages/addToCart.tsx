
import React, { useState, useRef, useContext, useEffect } from 'react';
import { Layout, Row, Col, Card, Divider, Image, Button, Typography } from 'antd';
import style from "../styles/Home.module.css";
import { ImportOutlined } from '@ant-design/icons';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import OrderContext from './orderContext';
import router from 'next/router';



const { Content, Header } = Layout;
const ButtonGroup = Button.Group;
const { Link } = Typography;

const CustomerByOrder = () => {
    const [stageCart, setStageCart] = useState([])
    const { carts, setCarts } = useContext(OrderContext)
    const [size, setSize] = useState<SizeType>('large');
    const [quantiys, setQuantiys] = useState();
    const [mat, setMat] = useState();

    useEffect(() => {
        var quantityCart = 0;
   //     console.log(carts)
        for (const i of carts) {
            quantityCart += i.quanity
            console.log(quantityCart)
           setQuantiys(quantityCart)
        }
        setStageCart(carts)
        let mat1 = 0;
        for (const i of carts) {
        //    console.log(i.product_price)
            mat1 += parseFloat(i.product_price) * i.quanity;
            setMat(mat1)
        //    console.log(mat);
        }
       
    }, [carts])

    function sendSumOrder(){
        router.push({
            pathname:"./sumOrderByCustomer"
        })
    }
 
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
                        <Col span={7} ></Col>
                        <Col span={9}><h3>ตะกร้าสินค้า</h3></Col>
                        <Col span={6}></Col>
                    </Row>
                    <Divider style={{ marginTop: -5 }} />
                    <Row style={{ marginTop: -20 }}>
                        <Col span={24}><h3>รายการสินค้า</h3></Col>
                    </Row>
                    {stageCart.map((data) => (
                        <Row >
                            <Col span={10} >
                                <Image src={process.env.NEXT_PUBLIC_API_URL+"/product/picture/" + data.img_product} />
                            </Col>
                            <Col span={3} ></Col>
                            <Col span={9} >
                                <h4>{data.product_name}</h4>
                                <p style={{ color: '#A9A9A9', marginTop: -20 }}>{data.subCate.sub_category_name}</p>
                                <h4 style={{ marginTop: 10 }} > {data.product_price} THB</h4>
                                <h5 style={{ marginTop: -10 }}>จำนวน :{data.quanity}</h5>
                            </Col>
                        </Row>
                        
                    ))}



                    <Divider style={{ marginTop: 20 }} />
                    <Row style={{ marginTop: -25 }}>
                        <Col span={24}><h3>จำนวนสินค้า : {quantiys} </h3></Col>
                    </Row>
                    <Row style={{ marginTop: -30 }}>
                        <Col span={24}><h3>จำนวนเงินรวม :{mat} THB</h3></Col>
                    </Row>
                    <Row style={{ marginTop: 10 }} >
                        <Col span={6} ></Col>
                        <Col span={13}  >
                            <Button style={{ marginTop: 0, width: "100%", background: "#523dce" }} onClick={()=> sendSumOrder()} type="primary" size={size} >
                                ต่อไป
                            </Button>
                        </Col>
                        <Col span={6} ></Col>
                    </Row>
                </Card>
            </Content>
        </Layout>
    );
};

export default CustomerByOrder;