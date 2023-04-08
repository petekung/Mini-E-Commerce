import React, { createContext, useContext, useState } from 'react';
import { Breadcrumb, Layout, Menu, InputNumber, Card, Row, Col, Button, Input, Space, Dropdown, Image, Checkbox, Alert, message, Badge } from 'antd';
import styles from '../../styles/Home.module.css'
import { UserOutlined, DownOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import Router from 'next/router';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import OrderContext from '../orderContext';

const ButtonGroup = Button.Group;

function orderItem({ record }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [quantiy, setQuantiy] = useState(1);
    const declineBadge = () => {
        let newBadgeCount = quantiy - 1;
        if (newBadgeCount < 0) {
            newBadgeCount = 0;
        }
        setQuantiy(newBadgeCount);

    };

    const increaseBadge = () => {
        setQuantiy(quantiy + 1);
    };

    const [checked, setChecked] = useState(false);
    const { carts, setCarts } = useContext(OrderContext)
    // console.log(record)
    const onChange = (e: CheckboxChangeEvent) => {
        //  console.log('checked = ', e.target.checked);
        setChecked(e.target.checked);
    };
    const label = `${checked ? 'Checked' : 'Unchecked'}`;
    function setCartOrder() {
        messageApi.open({
            type: 'success',
            content: 'เพิ่มสินค้าเข้าตะกร้า เรียบร้อย!',
          });
        { increaseBadge }
        setCarts([...carts, { ...record, quantiy }])
        
    }
    return (
        <div key={record.id} style={{ width: "100%" }} >
            
            <Row>
                <Col >
                    <Checkbox style={{ marginTop: 50 }} onChange={(e) => onChange(e)} />
                </Col>
                <Col offset={1}>
                    <Image src={process.env.NEXT_PUBLIC_API_URL+"/product/picture/" + record.img_product} alt="product" width={100} />
                </Col>
                <Col span={19} offset={1}>
                    <p > {record.product_name}</p>
                    <p> {record.product_detail}</p>
                </Col>
            </Row>
            <Row style={{ marginTop: -10, }} >
                <Col span={10} offset={4}>
                    <p id={styles.deliveryPurple}>{record.product_price} THB</p>
                </Col>
                <Col flex="auto"></Col>
                <Col span={5} offset={5} >
                    {label === 'Checked' &&
                        <ButtonGroup style={{ float: "right",}}>
                            <Button onClick={declineBadge} size={"large"}>
                                <MinusOutlined />
                            </Button>
                            <Button size={"large"} style={{ width: "50px", }} >
                                <Badge count={quantiy} style={{ width: "30px", height: "30px", background: "#ffffff", color: "#000000", marginTop: -5, fontSize: "15px" }}   > </Badge>
                            </Button>
                            <Button onClick={increaseBadge} size={"large"}>
                                <PlusOutlined />
                            </Button>
                        </ButtonGroup>}
                </Col>
            </Row>
            <Row >               
                <Col span={23} >
                {contextHolder}
                    {label === 'Checked' &&
                    
                        <Button id={styles.buttonInsertCart}
                            onClick={() => setCartOrder()}
                            block size={"large"}
                            style={{ marginTop: 10,}}
                        >
                            เพิ่มลงในคำสั่งซื้อ
                        </Button>}
                </Col>
            </Row>
        </div>
    );
}

export default orderItem;