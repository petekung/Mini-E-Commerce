import React, { useState, useEffect, useRef, useContext } from "react";
import type { ColumnsType } from "antd/es/table";
import { Table, Button, Image } from "antd";
import { useRouter } from "next/router";
import { ShoppingCartOutlined } from "@ant-design/icons";
interface DataType {
  key: React.Key;
  id: number;
  product_name: string;
  product_price: number;
  img_product: string;
  product_detail: string
}
import axios from "axios";
import OrderContext from "../../orderContext";
import UserContext from "../../userContext";
import axiosInstance from "../../../utils/axios";



function tabel_seemore({subId,UID}) {
//  console.log(UID)
  const tableRef = useRef(null);
  const router = useRouter();
  const { product_seemore } = router.query;
  const [data, setData] = useState([]);
  const [idSub , setIdSub ] = useState();
  const { userId, setUserId } = useContext(UserContext)
  useEffect(()=>{
    if(userId === undefined) return 
    setUserId(UID)
   
  },[UID,subId])
  useEffect(()=>{
    console.log(subId)
    setIdSub(subId)
  },[subId])
  function viewProduct(id) {
   // setUserId(UID)
    router.push({
      pathname:"../customerByOrder",
      query:{
        Id:id,
        UID:UID
      }
    })
  }
  const columns: ColumnsType<DataType> = [
    {
      title: "รูปภาพ",
      dataIndex: "",
      render: (_, record) => (
        <div>
          {" "}
          <Image
            src={process.env.NEXT_PUBLIC_API_URL+"/product/picture/" + record.img_product}
            style={{ width: "100px", height: "20%" }}
          ></Image>
        </div>
      ),
    },
    {
      title: "รุ่น",
      dataIndex: "",
      render: (_, record) => <div><p>{record.product_name}</p></div>,
    },
    {
      title: "ราคา",
      dataIndex: "costomer_fname",
      render: (_, record) => <div>{record.product_price}.-</div>,
    },
    {
      title: "เลือกสินค้า",
      render: (_, record) => (
        <div
        >
          <a>
            <Button
              type="primary"
              style={{
                backgroundColor: "#523dce",
                color: "#FFFFFF",
                overflow: "auto",

              }}

              onClick={()=> viewProduct(record.id)}>
              <ShoppingCartOutlined />
            </Button>
          </a>
        </div>
      ),
    },
  ];
  useEffect(() => {
    axiosInstance
      .get("/product/line/"+idSub)
      .then(function (response) {
        const dataseemore = response.data;
        const data: DataType[] = [];
        for (const item in dataseemore) {
          var userData = dataseemore[item];
          console.log(userData);
          data.push({
            key: " ",
            id: userData.id,
            product_name: userData.product_name,
            product_price: userData.product_price,
            img_product: userData.img_product,
            product_detail: userData.product_detail
          });
        }
        setData(data);
      });
  }, [idSub]);
  return (
    <div style={{ overflow: "auto" }}>
      <div style={{ marginBottom: 16 }}>
        <span style={{ marginLeft: 8 }}></span>
      </div>
      <Table columns={columns} dataSource={data} ref={tableRef} />
    </div>
  );
}

export default tabel_seemore;
