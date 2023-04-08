
import React, { useState, useRef, useContext, useEffect } from 'react';
import { Layout, Row, Col, Card, Divider, Image, Button, Typography, Select, Form } from 'antd';
import style from "../styles/Home.module.css";
import { ImportOutlined } from '@ant-design/icons';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import OrderContext from './orderContext';
import router from 'next/router';
import axios from 'axios';
import UserContext from './userContext';
import axiosInstance from '../utils/axios';
const { Content, Header } = Layout;
const ButtonGroup = Button.Group;
const { Link } = Typography;

interface DataType {
    key: React.Key;
    id: string;
    name: string;
    img: string;
    price: number
}
const SumOrberByCustomer: React.FC = () => {

    const [size, setSize] = useState<SizeType>('large');
    const { carts, setCarts } = useContext(OrderContext)
    const [data, setData] = useState([]);
    const [quantiy, setQuantiy] = useState([]);
    const [idShow, setId] = useState([]);
    const [mat, setMat] = useState();
    const [quantiys, setQuantiys] = useState();
    const [dataDeli, setDataDeli] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const { userId, setUserId } = useContext(UserContext)
  
    const handleChange = (value) => {
        //   console.log(value)
         setSelectedOption(value);
    };
  
    const deliveryPrice = 40;
    const sum = parseFloat(mat) + parseFloat(deliveryPrice);
    function sendData() {
       if(selectedOption === null) {
        alert("กรุณาเลือกบริการจัดส่ง");
        return;
       }
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            delivery_id: selectedOption,
            total_price: sum,
            payment_status:0, //ส่งค่า 0 ไปทุกครั้ง
            product_id: idShow,
            quantiy: quantiy, //เอาจำนวนของสินค้าส่งไป
            userId: userId

        });
        
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch(process.env.NEXT_PUBLIC_API_URL+"/insertProductOrder", requestOptions)
            .then(response => response.json())
            .then(result =>
                router.push({
                    pathname:"/successFullyOrder",
                    query:{id:result.id}
                })
            )   
            .catch(error => console.log('error', error));
            
        //   console.log(raw)     
    }

    useEffect(() => {
        axiosInstance.get('/insertProductOrder/delivery/insert').then(response => {
            setDataDeli(response.data)
            
        });
    }, [])
    if (carts.length == 0) {
        useEffect(() => {
            alert("กรุณาเพิ่มสินค้า")
            router.push("./see_more/product_seemore")
        }, [carts]);

    } else {


       
        useEffect(() => {
            var quantityCart = 0;
            setData(carts)
            const ids = [];
            const quantiys = [];
          
            for (const i of carts) {
                ids.push(i.id)
                quantiys.push(i.quanity)
                quantityCart += i.quanity
                console.log(quantityCart)
                setQuantiys(quantityCart)
            }
            setId(ids)
            setQuantiy(quantiys)
            console.log(quantiys)
            //
            let mat1 = 0;
            for (const i of carts) {
                //    console.log(i.product_price)
                mat1 += parseFloat(i.product_price) * i.quanity;
                setMat(mat1)
                //    console.log(mat);
            }
        }, [carts])
        console.log(data)
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
                         
                        
                            <Col span={12} offset={6}><h3>สรุปรายการสั่งสินค้า</h3></Col>
                            <Col span={6}></Col>
                        </Row>
                        <Divider style={{ marginTop: -5 }} />

                        <Row style={{ marginTop: -20 }}>
                            <Col span={24}><h3>รายการสินค้า</h3></Col>
                        </Row>
                        
                        {data.map((data) => (
                            <Row >
                                <Col span={10} >
                                    <Image src={process.env.NEXT_PUBLIC_API_URL+"/product/picture/" + data.img_product} />
                                </Col>
                                <Col span={3} ></Col>
                                <Col span={8} style={{ marginTop: 25 }}>
                                    <h4></h4>
                                    <p style={{ color: '#A9A9A9', marginTop: -20 }}></p>
                                    <h4 style={{ marginTop: 10 }} >{data.product_price} THB</h4>
                                    <h5 style={{ marginTop: -10 }}>จำนวน : {data.quanity}</h5>
                                </Col>
                            </Row>
                        ))}
                        <Divider style={{ marginTop: 20 }} />
                        <Row>
                            <Col span={24}>
                               
                                <Select
                                    style={{ width: '100%' }}
                                    value={selectedOption}
                                    onChange={handleChange} defaultValue={1} size={"large"} >
                                    <option>เลือกบริการจัดส่ง</option>
                                    {dataDeli.map((dali) => (
                                        <option value={dali.id}>{dali.delivery_name}</option>
                                    ))}
                                </Select>
                            </Col>
                        </Row>
                        <Divider style={{ marginTop: 20 }} />
                        <Row style={{ marginTop: -25 }}>
                            <Col span={24}><h3>สรุปยอด</h3></Col>
                        </Row>
                        <Row style={{ marginTop: -25 }}>
                            <Col span={24}><p>จำนวนสินค้า : {quantiys} </p></Col>
                        </Row>
                        <Row style={{ marginTop: -25 }}>
                            <Col span={24}><p>จำนาวนเงินรวม :{mat} THB</p></Col>
                        </Row>
                        <Row style={{ marginTop: -25 }}>
                            <Col span={24}><p>ค่าจัดส่ง : 40 THB</p></Col>
                        </Row>
                        <Row style={{ marginTop: -25 }}>
                            <Col span={24}><h4>ยอดที่ต้องชำระ : {mat + 40} THB</h4></Col>
                        </Row>
                        <Row style={{ marginTop: 20 }} >
                            <Col span={6} ></Col>
                            <Col span={13}  >
                                <Button style={{ marginTop: 0, width: "100%", background: "#523dce" }} type="primary" onClick={() => sendData()} size={size} >
                                    ต่อไป
                                </Button>
                            </Col>
                            <Col span={6} ></Col>
                        </Row>
                    </Card>
                </Content>
            </Layout>
        );
    }



};

export default SumOrberByCustomer;