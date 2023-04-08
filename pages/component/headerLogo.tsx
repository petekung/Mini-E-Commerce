import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import { Layout, Row, Col } from 'antd';

const { Header } = Layout;

export default function Heading() {
    return (
        <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%'  }} id={styles.navbar} >
                <Image src={`/LOGO2.png`} alt="logo" width={100} height={30} style={{ marginTop:1 }} />
        </Header>
    );
};