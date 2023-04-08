import React, { useState, useEffect, useContext } from 'react';
import { Breadcrumb, Layout, Menu, theme, Card, Row, Col, Button, Input, Select, Space, Image, InputNumber, Form, Badge } from 'antd';
import styles from '../styles/Home.module.css'
import Head from './component/headerLogo'
import router, { Router, useRouter } from 'next/router';
import axios from 'axios';
import billOrder from './billOrder';
import OrderContext from './orderContext';
import NavBar from './component/navBar';

const { Header, Content, Footer } = Layout;
const ButtonGroup = Button.Group;
const sumOrder: React.FC = () => {


    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_API_URL+"/insertProductOrder").then(response => {
            setData(response.data)
        });
    }, [])
    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_API_URL+"/insertProductOrder/delivery/insert").then(response => {
            setDataDeli(response.data)
            // console.log(dataDeli)
        });
    }, [])
    const [idShow, setId] = useState([]);
    const [dataDeli, setDataDeli] = useState([]);
    const [mat, setMat] = useState();
    const [data, setData] = useState([]);
    const [dataShow, setDataShow] = useState([]);
    const [quantiy, setQuantiy] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const handleChange = (value) => {
        //   console.log(value)
        setSelectedOption(value);
    };
    interface DataType {
        key: React.Key;
        id: string;
        name: string;
        img: string;
        price: number;
        quantiy:number;
    }
    const { carts, setCarts } = useContext(OrderContext)
    const deliveryPrice = 40;
    useEffect(() => {

        console.log(carts)
        const dataProps: DataType[] = [];
        const ids = [];
        const quantiys = [];
        for (const item of carts) {
            console.log(item)
            ids.push(item.id)
            quantiys.push(item.quantiy)
            dataProps.push({
                key: item.id,
                id: item.id,
                name: item.product_name,
                img: item.img_product,
                price: item.product_price,
                quantiy: item.quantiy
            })
            console.log(quantiys)
            setId(ids)
            setQuantiy(quantiys)
            setDataShow(dataProps)
        }
        console.log(idShow)
        let mat1 = 0;
        for (const i of carts) {
            mat1 += parseFloat(i.product_price) * i.quantiy;
            setMat(mat1)
               console.log(mat1);
        }
    }, [carts])
    const sum = parseFloat(mat) + parseFloat(deliveryPrice);
    //    console.log(idShow);
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
            payment_status: 0, //ส่งค่า 0 ไปทุกครั้ง
            product_id: idShow,
            quantiy: quantiy //เอาจำนวนของสินค้าส่งไป
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
                    pathname: "/billOrder",
                    query: {
                        id: result.id
                    }
                })
            )
            .catch(error => console.log('error', error));
        //   console.log(raw)     

    }
    function Rediract_back(){
        router.push({
            pathname:"./insertOrder"
        })
    }

    return (
        <Layout id={styles.navbarNewOrder}>
            <NavBar/>
            <Header id={styles.navbarNewOrder}>
                <Row>
                    <h1>สรุปออเดอร์&nbsp;</h1>
                    <h1>A#{idShow}</h1> {/*อ้างอิงออเดอร์จากฐานข้อมูล*/}
                </Row>
            </Header>
            <Content>
                <br />
                <Card >
                    <p>สินค้าที่สั่งซื้อ</p>
                    {/* สินค้าที่สั่งทั้งหมดจากที่เลือกมาจาก InsertOrder มา loop */}
                    <div>
                        {dataShow.map((data) => (
                            <Row>
                                <Col >
                                    <Image src={process.env.NEXT_PUBLIC_API_URL+"/product/picture/" + data.img} alt="product" width={"100px"} />
                                </Col>
                                <Col id={styles.floatRightOne} span={19} >
                                    <p>{data.name}</p>
                                </Col>
                                <Col id={styles.floatRightOne} span={3} >
                                    <p id={styles.deliveryPurple}> {data.price} THB</p>
                                    <InputNumber  size="small" defaultValue={data.quantiy+ "  ชิ้น"} readOnly />
                                </Col>
                            </Row>
                        ))}
                    </div>
                </Card>
                <br />
                <Card >
                    <p>การจัดส่ง</p>
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
                </Card>
                <br />
                <Card >
                    <Row>
                        <Col>
                            <p>สรุปยอด</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={21} >
                            <p>ราคารวมสินค้า</p>
                        </Col>
                        <Col span={3}>
                            <p>{mat} THB</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={21} >
                            <p>ค่าจัดส่ง</p>
                        </Col>
                        <Col span={3}>
                            <p> 40 THB</p>  
                        </Col>
                    </Row>
                    <Row>
                        <Col span={21} >
                            <p>ยอดที่ต้องชำระ</p>
                        </Col>
                        <Col span={3}>
                            <p id={styles.sizeCharacter}>{sum} THB</p> {/*เอามาจาก ราคารวมสินค้า+ส่วนลด+ค่าจัดส่ง*/}
                        </Col>
                    </Row>
                </Card>
            </Content >
            <br />
            <Footer id={styles.footerFixed}>
                <Row >
                    <Col span={24}>
                        <Button id={styles.buttonBack} type={"primary"} onClick={()=>Rediract_back()} block size={"large"}>กลับหน้าเลือกสินค้า</Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} >
                        <Button id={styles.buttonBill} type={"primary"} block size={"large"} onClick={() => sendData()}  >สร้างบิล</Button>
                    </Col>
                </Row>
            </Footer>
        </Layout >
    );
}

export default sumOrder;