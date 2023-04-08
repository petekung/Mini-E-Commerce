import React, { useState, useEffect, useContext } from "react";
import { Layout, Card, Row, Col, Typography, Badge, Avatar, Button, } from "antd";
import Tabel_seemore from "./table/[table_seemore]";
import { useRouter } from "next/router";
import OrderContext from "../orderContext";
import axiosInstance from "../../utils/axios";
const { Content, Footer } = Layout;
const { Text } = Typography;
const OrderDetail: React.FC = () => {
  const router = useRouter();
  const [subId, setSubId] = useState();
  const { Id } = router.query;
  const { UID } = router.query;
  const [data, setData] = useState([]);
  const { carts, setCarts } = useContext(OrderContext)

  const [cartCount, setCartCount] = useState(0);
  const [idProduct, setIdProduct] = useState();
  useEffect(() => {
    setCartCount(carts.length)
  }, [carts])
  useEffect(() => {
    if(Id === undefined) return
    setIdProduct(Id)
  }, [Id,idProduct])
  useEffect(() => {
    if(idProduct === undefined) return
       console.log(idProduct)
    axiosInstance
      .get("/product/line/" + idProduct)
      .then(function (response) {
        setData(response.data);
        //     console.log("DATA", data);
      });
  }, [idProduct]);
  function goTocart() {
    router.push({
      pathname: '../sumOrderByCustomer',
    })
  }

  return (
    <>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Content
          style={{
            padding: "0 30px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Row>
            <Col span={24}>
              <Card
                style={{
                  minHeight: "40vh",
                  marginRight: "1%",
                  marginLeft: "1%",
                  marginBottom: "1%",
                  marginTop: "1%",
                  height: "100",
                }}
              >
                <Row>
                  <Col flex="auto">
                    <Text style={{ fontSize: 25 }}>รายการสินค้าทั้งหมด {data.length} รายการ</Text>
                  </Col>
                </Row>
                <Tabel_seemore subId={idProduct} UID={UID} />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
};

export default OrderDetail;
