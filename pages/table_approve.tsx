import React, { useState, useEffect, useRef } from "react";
import type { ColumnsType } from "antd/es/table";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { Table,Space,Dropdown, Typography, Popconfirm, Drawer, Button, Form, Row, Col, Input,Divider, DatePicker,} from "antd";
import type { MenuProps } from "antd";
import { useRouter } from "next/router";
import { MoreOutlined, QuestionCircleOutlined, DeleteOutlined, PlusOutlined, ArrowDownOutlined, EyeOutlined, EditOutlined,SettingOutlined, DownloadOutlined} from "@ant-design/icons";
import type { DatePickerProps } from "antd";
const { Text } = Typography;
interface DataType {
  key: React.Key;
  order_id: number;
  customer_fname: number;
  customer_lname: string;
  tel: string;
  address: string;
  total_price: number;
  order_date: string;
  order_status: string;
}
const onChange: DatePickerProps["onChange"] = (date, dateString) => {
  console.log(dateString);
};
import axios from "axios";
import Link from "next/link";
import axiosInstance from "../utils/axios";
import { format } from "date-fns";

const text = <Text type="secondary">คุณต้องการลบออเดอร์นี้หรือไม่?</Text>;
function Orderall() {
  const [searcdate, setSearcdate] = useState("");
  const tableRef = useRef(null);
  const [data, setData] = useState<DataType[]>([]);
  const [selectid, setSelectID] = useState<DataType[]>([]);
  const [fname, setFname] = useState<DataType[]>([]);
  const [lname, setLname] = useState<DataType[]>([]);
  const [tel, setTel] = useState<DataType[]>([]);
  const [address, setAddress] = useState<DataType[]>([]);
  const [total_price, setTotal_price] = useState<DataType[]>([]);
  const [order_date, setOrder_date] = useState<DataType[]>([]);
  const [order_id, setOrder_id] = useState<DataType[]>([]);
  const [open, setOpen] = useState(false);
  const [dummyState, rerender] = React.useState(1);
    const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    setSearcdate(dateString);
    console.log("วันที่เลือก", dateString);
  };
  const edittext = <Text disabled  style={{fontSize:25}}>แก้ไข ออเดอร์ที่#A{order_id}</Text>
  const router = useRouter();
  const showDrawer = () => {
    setOpen(true);
    axiosInstance
      .get(""+ selectid)
      .then(function (response) {
        const DataEdit = response.data;
        setOrder_id(DataEdit.id)
        setFname(DataEdit.customer_fname);
        setLname(DataEdit.customer_lname);
        setTel(DataEdit.tel);
        setAddress(DataEdit.address);
        setTotal_price(DataEdit.total_price);
        setOrder_date(DataEdit.order_date);
      });

    console.log(order_id);
  };

  const onEdit = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      customer_fname: fname,
      customer_lname: lname,
      address: address,
      total_price: total_price,
      tel: tel,
    });
    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(process.env.NEXT_PUBLIC_API_URL+"/order/" + selectid, requestOptions)
      .then((response) => response.text())

      .catch((error) => console.log("error", error));
    rerender(dummyState + 1);
    setOpen(false);
  };
  const onCanceledit = () => {
    setOpen(false);
  };
  // console.log(selectid);
  const confirm = () => {
    console.log(selectid);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      order_status: 'DELETED',
      payment_status:0
    });
    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(process.env.NEXT_PUBLIC_API_URL + "/order/" + selectid, requestOptions)
      .then((response) => response.text())
      .catch((error) => console.log("error", error));
      rerender(dummyState + 1);

    // window.location.reload();
  };
  const Edit = (
    <Button type="link" style={{ color: "#ffaa00" }} onClick={showDrawer}>
      แก้ไขออเดอร์ <EditOutlined />
    </Button>
  );
  const Delete = (
    <Popconfirm
      placement="top"
      title={text}
      onConfirm={confirm}
      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
      okText="ใช่,ฉันต้องการลบ"
      cancelText="ไม่"
      onOpenChange={() => console.log("open change")}
    >
      <Button style={{ color: "red" }} type="link">
        ลบออเดอร์ <DeleteOutlined />
      </Button>
    </Popconfirm>
  );
  console.log();
  const items: MenuProps["items"] = [
    {
      label: (
        <div>
          <Button
            type="link"
            style={{ color: "#5DADE2 " }}
            onClick={() =>
              router.push({
                pathname:"/order_detail/"+selectid
              }   
              )
            }
          >
            ดูออเดอร์ <EyeOutlined />{" "}
          </Button>
        </div>
      ),
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: Edit,
      key: "2",
    },
    {
      type: "divider",
    },
    {
      label: Delete,
      key: "3",
    },
  ];
  const columns: ColumnsType<DataType> = [
    {
      title: "#เลขที่คำสั่ง",
      dataIndex: "",
      render: (_, record) => <div>#A{record.order_id}</div>,
    },
    {
      title: "ชื่อผู้สั่งซื้อ",
      dataIndex: "customer_fname",
      render: (_, record) => (
        <div>
          คุณ&nbsp;{record.customer_fname}&nbsp;{record.customer_lname}
        </div>
      ),
    },

    {
      title: "เบอร์โทร",
      dataIndex: "tel",
    },
    {
      title: "จังหวัด/เขต",
      dataIndex: "address",
    },
    {
      title: "ยอดที่ต้องชำระ",
      dataIndex: "total_price",
      render: (_, record) => (
        <div>
          {record.total_price} THB
        </div>
      ),
    },
    {
      title: "วันที่ซื้อ",
      dataIndex: "order_date",
        filteredValue: [searcdate],
      onFilter: (value, record) => {
        return record.order_date.includes(value);
      },
    },
    {
      title: "สถานะชำระเงิน",
      dataIndex: "order_status",
      render: (_, record) => (  
        <div>
          <Text type="success">
            {record.order_status ? (
              "อนุมัติการชำระเงินแล้ว"
            ) : (
              <Text type="warning"> ❗ยังไม่ได้ตรวจสอบ</Text>
            )}
          </Text>
        </div>
      ),
    },
    {
      title: "จัดการ",
      key: "action",
      render: (_, record) => (
        <div
          onClick={() => {
            // console.log(record);
            setSelectID(record.order_id);
          }}
        >
          <Dropdown menu={{ items }} trigger={["click"]}>
            <a>
              <Space>
                <MoreOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      ),
    },
  ];
  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_API_URL+"/order_approve/")
      .then(function (response) {
        const datares = response.data;
        const data: DataType[] = [];
        for (const item in datares) {
          var userData = datares[item];
          // console.log(userData);
          const DateTime = format(new Date(userData.timestamps), 'dd/MM/yyyy')
          data.push({
            key:userData.id,
            order_id: userData.id,
            customer_fname: userData.customer_fname,
            customer_lname: userData.customer_lname,
            tel: userData.tel,
            address: userData.address,
            total_price: userData.total_price,
            order_date: DateTime,
            order_status: userData.order_status,
          });
        }
        // rerender(dummyState + 1);
        // console.log(userData);

        setData(data);
      });
  }, [dummyState]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div>
      <Drawer
        title={edittext}
        width={720}
        onClose={onCanceledit}
        open={open}
        bodyStyle={{ paddingBottom: 10, overflow: "auto", minHeight: "10px" }}
        extra={
          <Space>
            <Button onClick={onCanceledit}>ยกเลิก</Button>
            <Button
              onClick={onEdit}
              type="text"
              style={{ backgroundColor: "#48C9B0",color: "#FFFFFF", }}
            >
              แก้ไขออดอร์<SettingOutlined />
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={12}>
              <Input
                addonBefore="ชื่อผู้สั่งชื้อ"
                type="text"
                set
                onChange={(event) => {
                  setFname(event.target.value);
                }}
                value={fname}
              />
            </Col>
            <Col span={12}>
              <Input
                style={{ width: "100%" }}
                addonBefore="นาสกุลผู้สั่งซื้อ"
                onChange={(event) => {
                  setLname(event.target.value);
                }}
                value={lname}
              />
            </Col>
          </Row>
          <br></br>
          <Row gutter={16}>
            <Col span={12}>
              <Input
                style={{ width: "100%" }}
                addonBefore="จังหวัด/เขต"
                onChange={(event) => {
                  setAddress(event.target.value);
                }}
                value={address}
              />
            </Col>
            <Col span={12}>
              <Input
                style={{ width: "100%" }}
                addonBefore="ยอดที่ต้องชำระ"
                type="Number"
                onChange={(event) => {
                  setTotal_price(event.target.value);
                }}
                value={total_price}
              />
              
            </Col>
          </Row>
          <br></br>
          <Row gutter={16}>
            <Col span={12}>
              <Input
                style={{ width: "100%" }}
                addonBefore="วันที่ซื้อ"
                onChange={(event) => {
                  setOrder_date(event.target.value);
                }}
                value={order_date}
              />
            </Col>
            <Col span={12}>
              <Input
                style={{ width: "100%" }}
                addonBefore="เบอร์โทรศัพท์"
                type="number"
                onChange={(event) => {
                  setTel(event.target.value);
                }}
                value={tel}
              />
              
            </Col>
            
          </Row>
          <br></br>
          <Row gutter={16}>  </Row>
        </Form>
      </Drawer>
      <Row>
        <Col flex="auto">
        <Text style={{ fontSize: 19 }}> ออเดอร์ที่อนุมัติการชำระเงิน {data.length} ออเดอร์</Text>
        </Col>
        <Row style={{marginTop:10}}>
          <Col>
            <Link href="/insertOrder">
              <Button
                style={{ float: "right", margin: 5, background: "#523dce" }}
                type="primary" size="middle"
              >
              <PlusOutlined /> เพิ่มออเดอร์ 
              </Button>
            </Link>
            </Col>
            <Col>
            <DownloadTableExcel
            filename="order_manager"
            sheet="order"
            currentTableRef={tableRef.current}
          >
            <Button style={{ float: "right", margin: 5, }} size="middle" icon={<DownloadOutlined />}>
                ดาวน์โหลด
              </Button>
          </DownloadTableExcel>
            </Col>
        </Row>
      </Row>
      <Divider style={{ marginTop: 5 }}/>
      <Row>
        <Col flex="auto" style={{ float: "right", margin: 5 }}>
          วันที่ซื้อ: <DatePicker onChange={onChange} />
        </Col>
      </Row>
      <div style={{ marginBottom: 16 }}>
        <span style={{ marginLeft: 8 }}>
         
        </span>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        ref={tableRef}
        style={{ overflow: "auto" ,marginTop: -20 }}
      />
    </div>
  );
}

export default Orderall;
