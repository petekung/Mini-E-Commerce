import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  Layout,
  Card,
  Row,
  Col,
  Button,
  Typography,
  Image,
  Modal,
  message,
  Divider,
  Alert,
  Avatar,
  Popconfirm,
  Input,
} from "antd";
import {
  PictureOutlined,
  UserOutlined,
  WhatsAppOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Navbar from "../component/navBar";
import { useRouter } from "next/router";
import axiosInstance from "../../utils/axios";
import { format } from "date-fns";
import styles from '../../styles/Home.module.css'
const { Content, Footer } = Layout;
const { Text, Link, Title } = Typography;
const OrderDetail: React.FC = () => {
  const router = useRouter();
  const { view } = router.query;
  // console.log(pid);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fname, setFname] = useState([]);
  const [lname, setLname] = useState([]);
  const [order_id, setOrder_id] = useState([]);
  const [order_date, setOrder_date] = useState(null);
  const [payment_status, setPayment_status] = useState([]);
  const [tel, setTel] = useState([]);
  const [email, setEmail] = useState([]);
  const [address, setAddress] = useState([]);
  const [total_price, setTotal_price] = useState([]);
  const [data, setData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const text = "อนุมัติการชำระเงินหรือไม่";
  const text_success_1 = "อนุมัติการชำระเงินแล้ว";
  const [mat, setMat] = useState();
  const [rerenders, setRerenders] = useState(1)
  const [imgBill, setImgBill] = useState();
  const [viewId, setViewId] = useState<any>();
  const [uuid, setUuid] = useState();
  const [value, setValue] = useState("");
  useEffect(() => {
    setViewId(view)
  }, [view])
  var Datas = [];
  const confirm = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      payment_status: 1,
      order_status: "COMPLETED"

    });
    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(process.env.NEXT_PUBLIC_API_URL + "/order/" + viewId, requestOptions)
      .then((response) => response.text())
      .catch((error) => console.log("error", error));
    messageApi
      .open({
        type: "loading",
        content: "กำลังอนุมัตการชำระเงิน",
        duration: 1,
      })
      .then(() => message.success("สำเร็จ", 0.5))
      .then(() => setRerenders(rerenders + 1));

    // console.log("อนุมัติเงิน");
  };
  const cancel = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      payment_status: 0,
      order_status: "WAITING_PAYMENT"
    });
    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(process.env.NEXT_PUBLIC_API_URL + "/order/" + viewId, requestOptions)
      .then((response) => response.text())
      .catch((error) => console.log("error", error));

    messageApi
      .open({
        type: "loading",
        content: "กำลังยกเลิกการอนุมัติการชำระเงิน",
        duration: 1,
      })
      .then(() => message.success("สำเร็จ", 0.5))
      .then(() => setRerenders(rerenders + 1));

  };
  useEffect(() => {
    axiosInstance
      .get("/order_list/" + viewId)
      .then(function (response) {
        if (!response) {
          alert("ลูกค้ายังไม่ได้เลือกสินค้า");
          window.location.assign("/order_management");
        }
        let Data = response.data;
        //     console.log(Data.timestamps);
        for (const item in response.data.orderList) {
          Datas.push(response.data.orderList[item])

        }
        //   console.log(Data.timestamps);
        if (Data.timestamps === undefined) return
        const DateTime = format(new Date(Data.timestamps), 'dd/MM/yyyy HH:mm')
        setData(Datas);
        setFname(Data.customer_fname);
        setLname(Data.customer_lname);
        setPayment_status(Data.payment_status);
        setOrder_id(Data.id);
        setOrder_date(DateTime);
        setTel(Data.tel);
        setEmail(Data.email);
        setAddress(Data.address);
        setTotal_price(Data.total_price);
        setImgBill(Data.img_bill)
        setUuid(Data.uuid);
        console.log("DATA", Data);
      });
  }, [viewId, rerenders]);

  const handleCopy = () => {

    try {
      navigator.clipboard.writeText(process.env.NEXT_PUBLIC_FN_URL + "/paymentView/?uuid=" + uuid).catch(err => {
        console.error('Error on server: ', err);
      });
    } catch (err) {
      console.error('Error on client: ', err);
    }
    // navigator.clipboard.writeText(process.env.NEXT_PUBLIC_FN_URL+"/paymentView/?uuid=" + uuid);
    messageApi.info('คัดลอกแล้ว');
  }

  const showModal = () => {
    setIsModalOpen(true);
    Modal.info({
      title: "หลักฐานการโอนของ คุณ " + fname + " " + lname,
      content: (
        <div>
          <Image
            src={process.env.NEXT_PUBLIC_API_URL + "/payment/" + imgBill}
            style={{ width: "300px", height: "400px" }}
          ></Image>
        </div>
      ),
      onOk() { },
    });
  };
  return (
    <>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Navbar />

        <Content
          style={{
            padding: "0 30px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>แผงควบคุม</Breadcrumb.Item>
            <Breadcrumb.Item>
              {" "}
              <Link href="/order_management">
                {" "}
                <Text type="secondary">ออเดอร์</Text>{" "}
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>รายละเอียดออเดอร์</Breadcrumb.Item>
          </Breadcrumb>
          <Title level={3}>
            ออเดอร์ #A{order_id}
            <Button
              style={{ float: "right" }}
              type="text"
              onClick={() => router.push("../order_management")}
            >
              ย้อนกลับ <RollbackOutlined />
            </Button>
          </Title>

          <Row>
            <Col span={16}>
              <Card
                style={{
                  minHeight: "1vh",
                  marginRight: 20,
                  marginBottom: 20,
                }}
              >
                <Row>
                  <Col flex="auto">
                    <Text type="secondary">วันที่สั่งซื้อ</Text>
                  </Col>
                  <Col flex="auto">
                    <Text type="secondary">ช่องทางที่สั่งซื้อ</Text>
                  </Col>
                  <Col flex="auto">
                    <Text type="secondary">สถานะ</Text>
                  </Col>
                </Row>
                <Row>
                  <Col flex="auto">
                    <Text>{order_date}</Text>
                  </Col>
                  <Col flex="auto">
                    <Text>mini POS</Text>
                  </Col>

                  <Col flex="auto">
                    <Text type="success">
                      {payment_status ? (
                        " 🟢จ่ายแล้ว"
                      ) : (
                        <Text type="warning"> 🟠 ยังไม่ได้ตรวจสอบสลิป</Text>
                      )}
                    </Text>
                  </Col>
                </Row>

                <Row>
                  <Col flex="auto"></Col>
                </Row>
                <br></br>
              </Card>

              <Card
                style={{
                  minHeight: "40vh",
                  marginRight: 20,
                  marginBottom: 20,
                }}
              >
                <Row>
                  <Col flex="auto">
                    <Text>สินค้าที่สั่งซื้อ</Text>
                  </Col>
                </Row>
                <br></br>

                {data.map((product) => (
                  <Row>
                    <br></br>
                    <Col flex="auto">
                      <Image
                        src={process.env.NEXT_PUBLIC_API_URL + "/product/picture/" + product.products.img_product}
                        style={{ width: "100px", height: "20%" }}
                      ></Image>
                    </Col>
                    <br></br>
                    <Col span={10}>{product.products.product_name} </Col>
                    <Col flex="auto">
                      <Text>{product.products.product_price} THB</Text>
                    </Col>
                    <Col flex="auto">
                      <Text>{product.quantiy} ชิ้น</Text>
                    </Col>

                    <Col flex="auto">
                      {product.products.product_price * product.quantiy} THB{" "}
                    </Col>
                  </Row>
                ))}

                <br></br>

                <br></br>
              </Card>
              <Card
                style={{
                  minHeight: "20vh",
                  marginRight: 20,
                  marginBottom: 20,
                }}
              >
                <Row>
                  <Col flex="auto">
                    <Text>การจัดส่ง</Text>
                  </Col>
                </Row>
                <br></br>
                <Row>
                  <Col flex="auto">
                    <Text>ไปรษณีย์ไทย</Text>
                  </Col>
                </Row>

                <Row>
                  <Col flex="auto">
                    <Text type="secondary"> 40 THB</Text>
                  </Col>
                  <Col flex="auto"></Col>
                  <Col flex="auto"></Col>
                  <Col flex="auto"></Col>
                  <Col flex="auto"></Col>
                  <Col flex="auto">
                    <Text type="secondary"> 40 THB</Text>
                  </Col>
                </Row>

                <Row>
                  <Col flex="auto"></Col>
                </Row>
                <br></br>
              </Card>

              <Card
                style={{
                  minHeight: "30vh",
                  marginRight: 20,
                  marginBottom: 20,
                }}
              >
                <Row>
                  <Col flex="auto">
                    <Text>สรุปยอด</Text>
                  </Col>
                </Row>
                <br></br>
                <Row>
                  <Col flex="auto">
                    <Text>รวมราคาสินค้า</Text>
                  </Col>
                  <Col flex="auto"></Col>
                  <Col flex="auto"></Col>
                  <Col flex="auto"></Col>
                  <Col flex="auto"></Col>

                  <Col flex="auto">
                    <Text>  {total_price - 40}  THB</Text>
                  </Col>
                </Row>
                <Row>
                  <Col flex="auto">
                    <Text>ค่าจัดส่ง</Text>
                  </Col>
                  <Col flex="auto"></Col>
                  <Col flex="auto"></Col>
                  <Col flex="auto"></Col>
                  <Col flex="auto"></Col>

                  <Col flex="auto">
                    <Text>40 THB</Text>
                  </Col>
                </Row>
                <br></br>
                <br></br>
                <br></br>
                <Row>
                  <Col flex="auto">
                    <Text style={{ marginRight: -50 }}>
                      ยอดที่ต้องชำระทั้งหมด
                    </Text>
                  </Col>
                  <Col flex="auto"></Col>
                  <Col flex="auto"></Col>
                  <Col flex="auto"></Col>
                  <Col flex="auto"></Col>

                  <Col flex="auto">
                    <Text> {total_price} THB</Text>
                  </Col>
                </Row>
              </Card>
              <Card
                style={{
                  minHeight: "2vh",
                  marginRight: 20,
                  marginBottom: 20,
                }}
              >
                <Row>
                  <Col flex="auto">
                    <Text>ข้อมูลการโอน</Text>
                  </Col>
                </Row>
                <br></br>
                <Row>
                  <Col flex="auto">
                    <Text type="secondary" style={{ marginRight: 0 }}>
                      ธนาคารที่โอนเข้า
                    </Text>
                  </Col>
                  <Col flex="auto">
                    <Text type="secondary"></Text>
                  </Col>
                  <Col flex="auto">
                    <Text type="secondary">ยอดที่โอน</Text>
                  </Col>
                  <Col flex="auto">
                    <Text type="secondary">วันที่โอน</Text>
                  </Col>
                  <Col flex="auto">
                    <Text type="secondary">หลักฐานการโอน</Text>
                  </Col>
                </Row>
                <Row>
                  <Col flex="auto">
                    <Text style={{ marginRight: 50 }}>
                      กสิกรไทย : <Text type="secondary">048-2-08528-0</Text>
                    </Text>
                  </Col>

                  <Col flex="auto">
                    <Text> {total_price} THB</Text>
                  </Col>
                  <Col flex="auto">
                    <Text>{order_date}</Text>
                  </Col>
                  <Col flex="auto">
                    <Button type="link" onClick={showModal}>
                      ดูสลิป <PictureOutlined />
                    </Button>
                  </Col>
                </Row>

                <Row>
                  <Col flex="auto"></Col>
                </Row>
                <br></br>
              </Card>
              <Card   style={{
                  minHeight: "2vh",
                  marginRight: 20,
                  marginBottom: 20,
                }}>
                <Row>
                  <Col flex="auto">
                    <Text>ลิ้งค์สำหรับลูกค้าแจ้งข้อมูลการโอน</Text>
                  </Col>
                </Row>
                <br></br>
                <Row>
                  <Col span={15} >
                    <Input value={process.env.NEXT_PUBLIC_FN_URL + "/paymentView/?uuid=" + uuid} onChange={(e) => setValue(e.target.value)} size="large" readOnly />
                  </Col>
                  <Col span={7} offset={1}>
                    {contextHolder}
                    <Button id={styles.buttonCopy} onClick={handleCopy} type={"primary"} block size={"large"} >
                      คัดลอก
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={8}>
              <Col flex="auto"></Col>
              <Card
                style={{
                  minHeight: "50vh",
                }}
              >
                {" "}
                <Title level={5} style={{ marginTop: 1 }}>
                  ข้อมูลลูกค้า <UserOutlined />
                </Title>
                <br></br>
                <Row>
                  <Col flex="auto">
                    <Avatar
                      size={40}
                      src={
                        <Image
                          style={{}}
                          src="https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
                        />
                      }
                    />
                  </Col>

                  <Col flex="auto">
                    คุณ&nbsp;
                    <Text style={{ color: "#5F76E8" }}>
                      {fname} {lname}
                    </Text>
                  </Col>

                  <Divider />
                  <Title level={5} style={{ marginTop: 1 }}>
                    ข้อมูลติดต่อ <WhatsAppOutlined />
                  </Title>
                  <br></br>
                </Row>
                <Row>
                  <Col flex="auto">
                    <Text>เบอร์โทร: </Text>
                  </Col>

                  <Col flex="auto">
                    <Text>{tel} </Text>
                  </Col>
                </Row>
                <Row>
                  <Col flex="auto">
                    <Text>อีเมล: </Text>
                  </Col>

                  <Col flex="auto">
                    <Text>{email}</Text>
                  </Col>
                </Row>
                <Row>
                  <Col flex="auto"></Col>

                  <Col flex="auto"></Col>
                </Row>
                <Divider />
                <Title level={5} style={{ marginTop: 1 }}>
                  ที่อยู่
                </Title>
                <Row>
                  <Col flex="auto">
                    <Text>{address}</Text>
                  </Col>
                </Row>
                <Divider />
                <Text type="success">
                  {payment_status ? (
                    <Alert message={text_success_1} type="success" showIcon />
                  ) : (
                    <Alert
                      message="ยังไม่ได้รับการอนุมัติการชำระเงิน"
                      type="error"
                      showIcon
                    />
                  )}
                </Text>{" "}
                {contextHolder}
                <Divider />
                <Col flex="auto" style={{ overflow: "auto" }}>
                  <Popconfirm
                    placement="right"
                    title={text}
                    onConfirm={confirm}
                    onCancel={cancel}
                    okText="ใช่,ฉันอนุมัติ"
                    cancelText="ยกเลิกการอนุมัติ"
                  >
                    <Button
                      size="large"
                      type="primary"
                      style={{ backgroundColor: "#48C9B0" }}
                    >
                      อนุมัติการชำระเงิน
                    </Button>
                  </Popconfirm>
                </Col>
              </Card>

            </Col>
          </Row>
        </Content>


      </Layout>
    </>
  );
};

export default OrderDetail;
