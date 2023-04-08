
import React, {  useRef } from 'react';
import { Breadcrumb, Layout, Card, Tabs, Row, Col, theme, } from "antd";
import Navbar from "./component/navBar";
import Table_Product from './tableProduct';
const {  Content, Footer } = Layout;
const App: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const onSearch = (value: string) => console.log(value);
    const tableRef = useRef(null);

    return (
        <Layout style={{ minHeight: "100vh", }}>
            <Navbar />
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
                <Breadcrumb style={{ margin: "16px" }}>
                    <Breadcrumb.Item>แผงควบคุม</Breadcrumb.Item>
                    <Breadcrumb.Item>สินค้าและโปรโมชั่น</Breadcrumb.Item>
                </Breadcrumb>
                <Row>
                    <Col  > <h2 style={{ padding: '25px', marginTop: -20, }}>สินค้าและโปรโมชั่น</h2></Col>
                </Row>
                <Tabs defaultActiveKey="1" style={{ padding: '25px', marginTop: -50, }}>
                    <Tabs.TabPane tab="สินค้า" key="1">
                            <Row >
                                <Col lg={{ span: 24 }}>
                                    
                                     <Table_Product /> 
                                     </Col>
                            </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="สินค้าจัดเป็นเซ็ต" key="2">
                        <Card
                            style={{
                                minHeight: "100vh",
                            }}
                        ></Card>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="โปรโมชั่น" key="3">
                        <Card
                            style={{
                                minHeight: "100vh",
                            }}
                        ></Card>
                    </Tabs.TabPane>
                </Tabs>
            </Content>
            <Footer style={{ textAlign: "center" }}>
                Ant Design ©2018 Created by Ant UED
            </Footer>
        </Layout>
    );
};

export default App;