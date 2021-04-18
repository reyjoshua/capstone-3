import React from 'react';
import Banner from '../components/Banner';
import Head from 'next/head';



export default function Home() {

    const data = {
        title: "Budget Tracker Application",
        content: "One Stop Track for Budget Needs!",
        destination:"/",
    }

    return (
        <React.Fragment>
            <Head>
                <title>Home</title>
            </Head>
            <Banner data={data}/>
        </React.Fragment>
    )
}