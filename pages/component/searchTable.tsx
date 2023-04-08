
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Layout, Row, Col, Card, Image, Button } from 'antd';
import OrderContext from '../orderContext';
import { useRouter } from 'next/router';
import UserContext from '../userContext';

function SearchTable({ dataShow }) {
    const router = useRouter();
    const { UID } = router.query;
    const { userId, setUserId } = useContext(UserContext)
    const [quantiy, setQuantiy] = useState(1);
    //   console.log(dataShow)
    const [cartCount, setCartCount] = useState(0);
    const increaseCart = () => {
        setCartCount(cartCount + 1)

    }
    const { carts, setCarts } = useContext(OrderContext)
    function setCartOrder() {
        { increaseCart }
        setCarts([...carts, { ...dataShow, quantiy }])

    }
    function viewProduct(id) {
        setUserId(UID)
        router.push({
            pathname: "../customerByOrder",
            query: {
                Id: id,
                UID: UID
            }
        })
    }


    return (
        <div>

            <Row style={{ marginTop: 10 }} >
                <Col span={24}>
                    {/* {dataShow.map((data) => ( */}
                    <div style={{ width: "100%", border: `1px solid #d9d9d9`, borderRadius: 8, margin: 5 }}>
                        <Row style={{ margin: 5, textAlign: "center" }}>
                            <Col span={24}>
                                <Image src={process.env.NEXT_PUBLIC_API_URL + "/product/picture/" + dataShow.img_product} style={{ width: "100%" }} />
                            </Col>
                        </Row>
                        <Row style={{ margin: 5, marginTop: -10 }}>
                            <Col >
                                <h3 style={{ width: "100%" }} >{dataShow.product_name}</h3>
                            </Col>
                        </Row>
                        <Row style={{ margin: 5, marginTop: -30 }} >
                            <Col >
                                <h3 style={{ color: '#A9A9A9' }}>{dataShow.subCate.sub_category_name}</h3>
                            </Col>
                        </Row>
                        <Row style={{ margin: 5, marginTop: -30 }} >
                            <Col >
                                <h3>{dataShow.product_price} THB</h3>
                            </Col>
                        </Row>


                        <Row style={{ margin: 5 }} >
                            <Col span={24}>
                                <Button onClick={() => viewProduct(dataShow.id)} style={{ width: "100%", background: "#523dce" }} type="primary" size="large" >
                                    ดูรายละเอียดสินค้า
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    {/* ))} */}
                </Col>
            </Row>
        </div>
    )
}
export default SearchTable;
