import React, { useState, useEffect, useRef, } from 'react';
import { Space, Table, Image, theme, Modal, Button, Card, Divider, Popconfirm, Dropdown, Tag, Select, } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { MoreOutlined, DownloadOutlined, EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { MenuProps, } from 'antd';
import axios from 'axios';
import { Layout, Row, Col, Typography, Input } from "antd";
import style from "../styles/Home.module.css";
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import Router from 'next/router';
import axiosInstance from '../utils/axios';

const { Link } = Typography;
const Table_Product: React.FC = () => {


  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);



  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    //   console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  
  const tableRef = useRef(null);
  const [size, setSize] = useState<SizeType>('middle'); // default is 'middle'
  const [open, setOpen] = useState(false);
  const [productname, setProductname] = useState(""); //ประการตัวแปร
  const [productprice, setProductprice] = useState("");
  const [Productsub, setProductsub] = useState("");
  const [productdetail, setProductdetail] = useState("");
  const [productstock, setProductstock] = useState("");
  const [productimg, setProductimg] = useState("");
  const [productsku, setProductsku] = useState("");
  const [select, setSelect] = useState("");
  const [searchText, setsearchText] = useState("");
  const [searchText2, setsearchText2] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [dummyState, rerender] = React.useState(1);
  const [data, setData,] = useState([]); ///ส่วนตาราง
  useEffect(() => {

    axiosInstance.get("/product").then(function (response) { //แสดงข้อมูลในตาราง
      const datares = response.data;
      const data: DataType[] = [];
      for (const item in datares) {
        var userData = datares[item];
        //console.log(userData.subCate.sub_category_name);
        data.push({
          key: userData.id,
          product_id: userData.id,
          product_name: userData.product_name,
          img_product: userData.img_product,
          product_price: userData.product_price,
          sku_id: userData.sku_id,
          sub_name: userData.subCate.sub_category_name,
          subId: userData.subCate.id,
        });
        setProductname(userData.product_name) //เซทตัวแปรก่อนเรียกใช้
        setProductdetail(userData.product_detail)
        setProductprice(userData.product_price)
        setProductimg(userData.img_product)
        setProductstock(userData.stock)
        setProductsku(userData.sku_id)
        setProductsub(userData.subCate.sub_category_name)
      }

      setData(data);

      //console.log(data)
    });
  }, [dummyState]);

  const confirm = () => {
    axiosInstance.delete("/product/" + select).then(function (response) {
      rerender(dummyState + 1); // ลบข้อมูล
      //window.location.assign("http://localhost:3000/listProduct")
    });
  };

  const View = () => {
    setOpen(true)
    if (!select) {
      return
    }
    axiosInstance
      .get("/product/" + select)  //ดูข้อมูล
      .then(function (response) {
        const dataView = response.data;
        //console.log(dataView);
        setProductname(dataView.product_name)
        setProductdetail(dataView.product_detail)
        setProductprice(dataView.product_price)
        setProductsub(dataView.subCate.sub_category_name)
        setProductimg(dataView.img_product)
        setProductstock(dataView.stock)
        setProductsku(dataView.sku_id)
      });

    //console.log(productname);
  }
  const cate = [];
  useEffect(() => {
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

  const Edit = () => {
    Router.push(
      {
        pathname: "/edit/" + select,
      })
  }
  interface DataType { //ตัวแปลง
    key: React.Key;
    img_product: string;
    product_name: string;
    product_id: string;
    product_price: number;
    sku_id: number;
    subId: string;
    sub_name: string;

  }


  const columns: ColumnsType<DataType> = [ //หัวตาราง
  {
    filteredValue: [searchText2],
    onFilter: (value, record) => {
      return (
        String(record.subId)
          .toLowerCase()
          .includes(value.toLowerCase())
      );
    },
  },
    {
      title: 'ชื่อ',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Image width={50} src={process.env.NEXT_PUBLIC_API_URL + "/product/picture/" + record.img_product} />
          <p> {record.product_name}</p>
        </Space>
      ),
      width: '50%',
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          String(record.product_name)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.sku_id)
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      },
    }, 
    {
      title: 'รหัส SKU',
      dataIndex: 'sku_id',
      width: '10%',

    },
    {
      title: 'หมวดหมู่สินค้า',
      key: 'action',
      render: (_, record) => (
        <Space size="middle"><p>{record.sub_name}</p> </Space>
      ),
      width: '15%',
    },
    {
      title: 'ราคา',
      key: 'action',
      render: (_, record) => (
        <Space size="middle"><p>{record.product_price} THB</p> </Space>
      ),
      width: '15%',
    },

    {
      title: 'จัดการ',
      key: 'action',
      render: (_, record) => (
        <Dropdown menu={{ items }}>
          <a onClick={(e) => setSelect(record.product_id)} > <Space><MoreOutlined /></Space></a>
        </Dropdown>
      ),
    },


  ];
  // console.log("select", select)

  const items: MenuProps['items'] = [ //ตรงจัดการ 3 เมนู View
    {
      key: '1',
      label: (
        <a onClick={View} style={{ color: "#1a8cff" }}>ดูข้อมูลสินค้า <EyeOutlined /> </a>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: (<a onClick={Edit} style={{ color: "#ffcc00" }}>แก้ไขสินค้า <EditOutlined /> </a>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: (
        <Popconfirm title="ยืนยันการลบข้อมูลสินค้า" okText="ยืนยัน" cancelText="ยกเลิก" onConfirm={confirm}>
          <a style={{ color: "red" }}>ลบข้อมูล <DeleteOutlined /> </a>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Card className={style.right2} style={{ minHeight: "100vh", marginTop: 10, }} >

        <Row>
          <Col flex="auto">
            <Col lg={{ span: 24 }} ><h1>สินค้า </h1>

            </Col>
          </Col>
          <Row style={{ marginTop: 10 }}>
            <Col>
              <Link href="./addProduct">
                <Button
                  style={{ float: "right", margin: 5, background: "#523dce" }}
                  type="primary" size="middle" icon={<PlusOutlined />}
                >
                  เพิ่มสินค้าใหม่
                </Button>
              </Link>
            </Col>
            <Col>
              <DownloadTableExcel filename="Product table" sheet="Product" currentTableRef={tableRef.current}
              >
                <Button style={{ float: "right", margin: 5, }} size="middle" icon={<DownloadOutlined />}>
                  ดาวน์โหลด
                </Button>
              </DownloadTableExcel>
            </Col>
          </Row>
        </Row>

        <Divider style={{ marginTop: 10 }} />
        <Row style={{ marginTop: -10, }} >
          <Col>
            <h3 style={{ marginTop: 0, }} >
              <Input.Search
                placeholder="ค้นหาจากชื่อสินค้า/รหัสสินค้า"
                size={size}
                style={{ width: "270px" }}
                onSearch={(value) => {
                  setsearchText(value);
                }}
                onChange={(e) => {
                  setsearchText(e.target.value);
                }}
              />
            </h3>
          </Col>
          <Col flex="auto"></Col>
          <Col>
            <Select size={size}
              defaultValue={"เลือกหมวดหมู่สินค้า"}
              onSearch={(value) => { setsearchText2(value); }}
              onChange={(e) => { setsearchText2(e); }}
              style={{ width: "270px" }} >
              <Select.Option value={""} required >ทั้งหมด</Select.Option>
              {categoryData.map((data) => (
                <Select.Option value={data.id} required >{data.sub_category_name}</Select.Option>)
              )}
            </Select>
          </Col>
        </Row>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          ref={tableRef}
          style={{ overflow: "auto", marginTop: 10 }}
        />
      </Card>


      <Modal
        title="รายละเอียดสินค้า"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
      >
        <Row style={{ marginTop: 20, marginLeft: 10, }}>

          <Col lg={{ span: 5 }} >

            <Image src={process.env.NEXT_PUBLIC_API_URL + "/product/picture/" + productimg} />

          </Col>
          <Col lg={{ span: 1 }}></Col>
          <Col lg={{ span: 15 }}>
            <Row>
              <Col lg={{ span: 7 }}> <h3>ชื่อสินค้า</h3></Col>
              <Col lg={{ span: 17 }}> <p style={{ margin: 10, marginTop: 20, }} >{productname}</p></Col>
            </Row>
            <Row>
              <Col lg={{ span: 7 }}><h3>รายละเอียดสินค้า</h3></Col>
              <Col lg={{ span: 17 }}> <p style={{ margin: 10, marginTop: 20, }}>{productdetail}</p></Col>
            </Row>
            <Row>
              <Col lg={{ span: 7 }}><h3>หมวดหมู่สินค้า</h3></Col>
              <Col lg={{ span: 17 }}> <p style={{ margin: 10, marginTop: 20, }}>{Productsub}</p></Col>
            </Row>
            <Row>
              <Col lg={{ span: 7 }}><h3>รหัสสินค้า</h3></Col>
              <Col lg={{ span: 17 }}> <p style={{ margin: 10, marginTop: 20, }} >{productsku}</p></Col>
            </Row>
            <Row>
              <Col lg={{ span: 7 }}><h3>จำนวนสินค้า</h3></Col>
              <Col lg={{ span: 17 }}> <p style={{ margin: 10, marginTop: 20, }} >{productstock}</p></Col>
            </Row>
            <Row>
              <Col lg={{ span: 7 }}><h3>ราคาสินค้า</h3></Col>
              <Col lg={{ span: 17 }}> <p style={{ margin: 10, marginTop: 20, }} >฿{productprice}</p></Col>
            </Row>
          </Col>
        </Row>
      </Modal>

    </div>
  );
};

export default Table_Product;


