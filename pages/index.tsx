import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import dynamic from 'next/dynamic';
import TableLayer from '../components/Tablelayer/TableLayer';
const NoSSRComponent = dynamic(() => import("../components/Tablelayer/TableLayer"), {
  ssr: false,
});
export default function Home() {
  return (
    <div className={styles.container}>
    <NoSSRComponent/>
    {/* <TableLayer/> */}
    </div>
  )
}
