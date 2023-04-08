import React, { Component, useContext, useEffect, useState } from 'react';
import { Layout, Card, Row, Col, Tabs, Image, Button } from 'antd';
import styles from '../styles/Home.module.css'
import Head from './component/headerLogo'
import OrderContext from './orderContext';
import { redirect } from 'next/dist/server/api-utils';
import router, { Router } from 'next/router';
import NavBar from './component/navBar';



const { Header, Content, Footer } = Layout;

const cartOrder = () => {

    const [showCart, setShowCart] = useState([]);
    const [quantiys, setQuantiys] = useState();
    const { carts, setCarts } = useContext(OrderContext);
    const [mat, setMat] = useState();
    const [quantiy, setQuantiy] = useState([]);
    const [idShow, setId] = useState([]);
 

    interface DataType {
        key: React.Key;
        id: string;
        name: string;
        img: string;
        price: number
    }
    if (carts.length == 0) {
        useEffect(() => {
            router.push("/insertOrder")
        }, [carts]);
    } else {
        var quantityCart = 0;
        useEffect(() => {
            console.log(carts)
            setShowCart(carts)
            setQuantiys(quantityCart)
            for (const i of carts) {
                quantityCart += i.quantiy
            }
          
        }, [carts])
        console.log(quantiys)
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
                    key:item.id,
                    id: item.id,
                    name: item.product_name,
                    img: item.img_product,
                    price: item.product_price,
                    quantiy: item.quantiy
                })
                console.log(dataProps)
                setId(ids)
                setQuantiy(quantiys)
            }
            let mat1 = 0;
            for (const i of carts) {
                mat1 += parseFloat(i.product_price) * i.quantiy;
                setMat(mat1)
                console.log(mat1);
            }
        }, [carts])
        const sum = parseFloat(mat)
        const sendProp = () => {
            router.push({
                pathname: './sumOrder',
            })
        }

        return (

            <Layout id={styles.navbarNewOrder}>
                <NavBar />
                <br />
                < Content >
                    <Card>
                        <div>
                            {showCart.map((data) => (
                                <Row>
                                    <Col >
                                        <Image src={process.env.NEXT_PUBLIC_API_URL+"/product/picture/" + data.img_product} alt="product" width={100} height={100} />
                                    </Col>
                                    <Col id={styles.floatRightOne} >
                                        <p style={{ width:"300px" }} >{data.product_name}</p>

                                        <Col span={8}>
                                            <p id={styles.characterTextTwo}>{data.product_price} THB</p>
                                        </Col>
                                        <Row>
                                            <Col span={8}>
                                                <p id={styles.characterTextOne}>จำนวน&nbsp;{data.quantiy}</p>
                                            </Col>
                                            {/* <Col>
                                                <p id={styles.characterTextThree}>{data.quantiy}</p> {/*อิงตามจำนวน*/}
                                            {/* </Col> */} 
                                        </Row>
                                    </Col>
                                </Row>
                                
                            ))}
                        </div>
                    </Card>
                </Content>
                <Footer id={styles.footerFixed}>
                    <Row>
                        <p id={styles.characterTextThree}>จำนวนสินค้า&nbsp;:&nbsp;</p>
                        <p id={styles.characterTextThree}>{quantiys}</p> {/*เอาสินค้าทั้งหมดมารวมกัน*/}
                    </Row>
                    <Row>
                        <p id={styles.characterTextThree}>จำนวนเงินรวม&nbsp;:&nbsp;</p>
                        <p id={styles.characterTextTwo}>{sum}&nbsp;</p> {/*เอาราคาสินค้าทั้งหมดมารวมกัน*/}
                        <p id={styles.characterTextTwo}>THB</p>
                    </Row>
                    <Row>
                        <Button id={styles.buttonOrder} type={"primary"} onClick={() => sendProp()} block size={"large"}>ไปต่อ</Button>
                    </Row>
                </Footer>
            </Layout >
        )
    }

}

export default cartOrder;