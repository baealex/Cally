import React from 'react';
import Head from 'next/head';

import '../styles/main.scss'

export default function App({ Component, pageProps }) {
    return (
        <React.Fragment>
            <Head>
                <title>IUCalendar</title>
            </Head>
            <div>
                <Component {...pageProps} />
            </div>
        </React.Fragment>
    );
};
