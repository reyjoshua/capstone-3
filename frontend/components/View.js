import React from 'react';
import Head from 'next/head';
import {Container} from 'react-bootstrap';

//Create a reusable component to add a title to the page and add the mobile responsive meta tag to make the page layout look better on smaller screens
const View = ({title, children}) => {
    return (
    <React.Fragment>
        <Head>
            <title key="title-tag">{title}</title>
            <meta key="title-meta" name="viewport" content="initial-scale=1.0, width=device-width"/>
        </Head>
        <Container className="mt-5 pt-5 mb-5">
            {children}
        </Container>
    </React.Fragment>
    )
}
export default View