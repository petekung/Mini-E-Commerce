import React from "react";
import { Breadcrumb, Layout, Tabs, Typography } from "antd";
import NavBar from "./component/navBar";
const { Content, Footer } = Layout;
const { Title, Text } = Typography;
import All_order from "./all_order";
import Approve_order from "./approve_order";
const Table_ordermanager: React.FC = () => {
  const Tab2 = <Text> ออเดอร์ที่ชำระเงินแล้ว</Text>;
  const Tab1 = <Text> ออเดอร์ทั้งหมด</Text>;

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <NavBar />
      <Content style={{ padding: "0 30px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>แผงควบคุม</Breadcrumb.Item>
          <Breadcrumb.Item>ออเดอร์</Breadcrumb.Item>
        </Breadcrumb>
        <Title level={3}>ออเดอร์ทั้งหมด</Title>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={Tab1} key="1">
            <All_order />
          </Tabs.TabPane>
          <Tabs.TabPane tab={Tab2} key="2">
            <Approve_order />
          </Tabs.TabPane>
        </Tabs>
      </Content>
      <Footer style={{ textAlign: "center" }}>E-commerce</Footer>
    </Layout>
  );
};

export default Table_ordermanager;
