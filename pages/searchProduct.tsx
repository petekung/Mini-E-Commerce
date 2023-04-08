
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Layout, Row, Col, Card, Image, Button, Typography, Input, Space, Select, Badge, Avatar, Divider, Table } from 'antd';
import style from "../styles/Home.module.css";
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { ShoppingCartOutlined, ImportOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../utils/axios';
import { ColumnsType } from 'antd/es/table';
import SearchTable from './component/searchTable';
import UserContext from './userContext';
import OrderContext from './orderContext';
import { useRouter } from 'next/router';
// import liff from '@line/liff'
const { Content, Header } = Layout;
const { Search } = Input;
const { Link } = Typography;

 let liff: any;
const SearchProduct: React.FC = () => {

  
   
    const [searchText, setsearchText] = useState("");
    const [searchText2, setsearchText2] = useState("");
    const [size, setSize] = useState<SizeType>('large');
    const onSearch = (value: string) => console.log(value);
    const [data, setData] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [categoryData, setCategoryData] = useState([]);
    const { carts, setCarts } = useContext(OrderContext)
    const { userId , setUserId} = useContext(UserContext)
    interface DataType { //ตัวแปลง
        key: React.Key;
        img_product: string;
        product_name: string;
        product_id: string;
        product_price: number;
        subId: string;
    }

    const columns: ColumnsType<DataType> = [
        { filteredValue: [searchText2],
            onFilter: (value, record) => {
                return (
                    String(record.subId)
                        .toLowerCase()
                        .includes(value.toLowerCase())
                );
            
            },
            width: '1px',
        },
            
        {
            

            render: (_, record) => (


                <SearchTable dataShow={record} />
            ),

            filteredValue: [searchText],
            onFilter: (value, record) => {
                return (
              //      console.log(value),
                    String(record.product_name)
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    String(record.product_price)
                        .toLowerCase()
                        .includes(value.toLowerCase())
                );

            }
        },{ width: '1px',}
    ]

    useEffect(() => {
        axiosInstance.get("/product").then(function (response) { //แสดงข้อมูลในตาราง
        //    console.log(response.data)
            setData(response.data)
        });
    }, []);
    // console.log(data)
    const cate = [];
    useEffect(() => {
        if (!categoryData === undefined) return
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
    const router = useRouter();
    const UserId = router.query.UID
    const sentTocart = ()=>{
        setUserId(UserId)
        router.push({
            pathname:"/addToCart",
            query:{UID:UserId}
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
                        <Col span={14} offset={8}><h3 >ค้นหาเพิ่มเติม</h3></Col>
                        <Col span={1} style={{ marginTop: 15, }}>
                            <Link onClick={()=>sentTocart()}>
                                <Badge count={carts.length} >
                                    <Avatar shape="square" icon={<ShoppingCartOutlined style={{ color: "#000000" }} />} style={{ backgroundColor: "#E8E8E8 " }} />
                                </Badge>
                            </Link>
                        </Col>
                    </Row>
                    <Divider style={{ marginTop: -3 }} />
                    <Row style={{ marginTop: -20 }}>
                        <Col span={15} offset={8}><h1>ค้นหาเพิ่มเติม</h1></Col>
                    </Row>
                    <Row style={{ marginTop: -30, color: '#A9A9A9' }}>
                        <Col span={21} offset={3}><p>เพื่อนให้ระบบแสดงสินค้าที่คุณต้องการที่สุด</p></Col>
                    </Row>
                    <Row style={{ marginTop: -20 }}>
                        <Col><h3>เลือกการค้นหา</h3></Col>
                    </Row>
                    <Row style={{ marginTop: -10 }} >
                        <Input.Search placeholder="ชื่อสินค้า" onSearch={(value) => {
                            setsearchText(value);
                           // console.log(value)
                        }}
                            onChange={(e) => {
                                setsearchText(e.target.value);
                           //     console.log(e)
                            }} style={{ width: "100%" }} size={size} />
                    </Row>
                    <Row style={{ marginTop: 15 }} >
                        <Select style={{ width: "100%" }} size={size} placeholder="เลือกหมวดหมู่สินค้าที่ต้องการ" onSearch={(value) => { setsearchText2(value); }} onChange={(e) => { setsearchText2(e);  }}>
                            <Select.Option value={""} required >ทั้งหมด</Select.Option>
                            {categoryData.map((data) => (
                                <Select.Option value={data.id} required >{data.sub_category_name}</Select.Option>
                            ))}
                        </Select>
                    </Row>
                    <div>
                        <Table columns={columns} dataSource={data} />

                    </div>
                </Card>
            </Content>
        </Layout>
    );
};

export default SearchProduct;