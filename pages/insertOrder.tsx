import React from 'react';
import { useState, useEffect, createContext, useContext } from 'react';
import { Breadcrumb, Layout, Menu, InputNumber, Card, Row, Col, Button, Input, Space, Dropdown, Image, Checkbox, Select, Table, Badge, Avatar } from 'antd';
import styles from '../styles/Home.module.css'
import { UserOutlined, DownOutlined } from '@ant-design/icons';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Router, { useRouter } from 'next/router';
import axios from 'axios';
import OrderItem from './component/orderItem';
import OrderContext, { ProductContext, Provider } from './orderContext';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import NavBar from './component/navBar';
import axiosInstance from '../utils/axios';

const { Search } = Input;
const onSearch = (value: string) => console.log(value);
const { Header, Content, Footer } = Layout;
const handleMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
};

function insertOrder() {
    const { carts, setCarts } = useContext(OrderContext)
    useEffect(() => {
     //   console.log(carts.length)
        setCartCount(carts.length);
    }, [carts])

    const [cartCount, setCartCount] = useState(0);

    const [categoryData, setCategoryData] = useState([]);
    /////////////////////////
    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_API_URL+"/insertProductOrder").then(response => {
            setData(response.data)
        });
    }, [])
   
    const [data, setData] = useState([]);
    const [searchText, setsearchText] = useState("");
    const [searchText2, setsearchText2] = useState("");
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    // console.log(data)

    const sendProp = () => {
        Router.push({
            pathname: './sumOrder',
        })
    }
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    interface DataType { //ตัวแปลง
        key: React.Key;
        img_product: string;
        product_name: string;
        product_id: string;
        product_price: number;
        subId: string;
    }

    const columns: ColumnsType<DataType> = [
        {
            filteredValue: [searchText],
            onFilter: (value, record) => {
                return (
                    String(record.product_name)
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    String(record.subId)
                        .includes(value.toLowerCase())
                );

            },           
            render: (_, record) => (
                    <OrderItem record={record} />
            ),
            width: '100%',
        },
        {
            filteredValue: [searchText2],
            onFilter: (value, record) => {
                return (
                    String(record.subId)
                        .includes(value.toLowerCase())
                );
            }
        }
    ]

    const cate = [];
    useEffect(() => {
        if(data === undefined) return
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

    }, [data])
    console.log(data)
    return (

        <Layout id={styles.navbarNewOrder}>
            <NavBar />
            <Header id={styles.navbarNewOrder}>
                <Row >
                    <h1>เพิ่มออเดอร์ใหม่</h1>
                </Row>
            </Header>

            <Card style={{ backgroundColor: "#F0F0F0" }}>
                <Row>
                    <Col span={24}>
                        <Input.Search
                            placeholder="ค้นหาจากชื่อสินค้า/รหัสสินค้า"
                            size={"large"}
                            onSearch={(value) => {
                                setsearchText(value);
                                console.log(value)
                            }}
                            onChange={(e) => {
                                setsearchText(e.target.value);
                                console.log(e)
                            }}
                            style={{ width: "100%" }}
                        />
                    </Col>
                </Row>
            </Card>
            <Content>
                <br />
                <Card >
                    <Row>
                        <Col span={24} >
                            <Select size={"middle"} defaultValue={"เลือกหมวดหมู่สินค้า"} onSearch={(value) => { setsearchText2(value); console.log(value) }} onChange={(e) => { setsearchText2(e); console.log(e) }} style={{ width: "100%" }} >
                            <Select.Option value={""} required >ทั้งหมด</Select.Option>
                                {categoryData.map((data) => (
                                    <Select.Option value={data.id} required >{data.sub_category_name}</Select.Option>
                                    ))}
                            </Select>
                        </Col>
                    </Row>
                </Card>
                <br />
                <Card >
                    <p>เลือกสินค้า</p>
                    <Table columns={columns} dataSource={data} />
                </Card>
            </Content >
            <br />
            <Footer id={styles.footerFixed}>
                <Row >
                    <Col span={4} >

                        <Link href='./cartOrder'>
                            <Badge count={cartCount}  >
                                <Avatar shape="square" icon={<ShoppingCartOutlined style={{ color: "#000000" }} />} style={{ backgroundColor: "#E8E8E8 " }} />
                            </Badge>
                        </Link>

                    </Col>
                    <Col span={20} >
                        <Button id={styles.buttonOrder} type={"primary"} block size={"large"} onClick={() => sendProp()} >ไปต่อหน้าสรุปออเดอร์</Button>
                    </Col>
                </Row>
            </Footer>
        </Layout >
    );

}

export default insertOrder;
