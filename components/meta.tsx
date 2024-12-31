import Head from "next/head";

export default function Meta(props) {
  return (
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
      />
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <link
        rel="mask-icon"
        href="/favicon/safari-pinned-tab.svg"
        color="#000000"
      />
      <link rel="shortcut icon" href="/favicon/favicon.ico" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      <meta name="theme-color" content="#000" />
      <meta property="og:title" content={props.siteTitle.title} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://liviafoldes.com/" />
      <meta property="og:description" content={props.metaContent.siteDescription} />
      <meta property="og:image" content={props.metaContent.ogImage.node.sourceUrl} />
      <meta property="og:image:type" content={props.metaContent.ogImage.node.mimeType} />
      <meta property="og:image:width" content={props.metaContent.ogImage.node.mediaDetails.width} />
      <meta property="og:image:height" content={props.metaContent.ogImage.node.mediaDetails.height} />
      <meta property="og:image:alt" content={props.metaContent.ogImage.node.altText} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@liviatronic" />
      <meta name="twitter:creator" content="@liviatronic" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
    </Head>
  );
}
