import Meta from "./meta";

export default function Layout({title, meta, className, preview, children }) {
  return (
    <>
      <Meta metaContent={meta} siteTitle={title} />
      <div className="min-h-screen">
        <main className={className}>{children}</main>
      </div>
    </>
  );
}
