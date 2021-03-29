import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css"
            rel="stylesheet"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2563eb" />
          <meta name="apple-mobile-web-app-title" content="Routes by You" />
          <meta name="application-name" content="Routes by You" />
          <meta name="msapplication-TileColor" content="#2563eb" />
          <meta name="theme-color" content="#bfdbfe" />
          <meta name="description" content="Set and share your own boulders" />
          <link rel="icon" href="/favicon.ico" />
          <meta property="og:title" content="Routes by You" />
          <meta
            property="og:description"
            content="Set and share your own boulders"
          />
          <meta property="og:url" content="https://routesbyyou.com" />
          <meta
            property="og:image"
            content="https://routesbyyou.com/og-image.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
