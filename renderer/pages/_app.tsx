import Head from 'next/head';

import '../styles/main.scss';

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Cally</title>
            </Head>
            <div>
                <Component {...pageProps} />
            </div>
        </>
    );
}
