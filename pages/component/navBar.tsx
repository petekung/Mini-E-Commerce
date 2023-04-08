import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import { Breadcrumb, Layout, Menu, Row, theme, Col, Drawer } from 'antd';
const { Header, Content, Footer } = Layout;
import type { MenuProps } from 'antd';
import { SettingOutlined, DownOutlined, MenuOutlined } from '@ant-design/icons';
import Link from 'next/link'
import MenuItem from 'antd/es/menu/MenuItem';
import { useState } from 'react';


export default function NavBar() {

    const [openMenu, setOpenMenu] = useState(false);
    ;
    return (
        <div>

            <div style={{ backgroundColor: "#523dce", height: "40", paddingLeft: 10, paddingTop: 10, paddingBottom: 10 }} className={styles.menuIcon}>
                <MenuOutlined style={{ color: "white", fontSize: 25 }} onClick={() => {
                    setOpenMenu(true);
                }} />
            </div>
            <span className={styles.headerMenu} >
                <AppMenu />
            </span>
            <Drawer size="default"
                placement='left'
                open={openMenu}
                onClose={() => {
                    setOpenMenu(false);
                }} closable={false} bodyStyle={{ backgroundColor: "#523dce" }}>
                <AppMenu isInline />
            </Drawer>
        </div>
    );
};
function AppMenu({ isInline = false }) {
    return (

        <Menu style={{ backgroundColor: "#523dce", color: "white", border: "none"}}
            mode={isInline ? "inline" : "horizontal"}
            items={[
                { label: <Image src={`/LOGO2.png`} alt="logo" width={100} height={30} />, key: 'item-0'  },
                { label: <Link href='../listProduct'>สินค้า</Link>, key: 'item-1'}, 
                { label: <Link  href='../order_management'>ออเดอร์</Link>, key: 'item-2' },
            ]}></Menu>
    )
}


