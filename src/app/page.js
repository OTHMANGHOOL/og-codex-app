import Image from "next/image";

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        direction: "rtl",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <Image src="/next.svg" alt="شعار Next.js" width={200} height={50} />
      <h1 style={{ fontSize: "2rem", marginTop: "1rem" }}>
        مرحباً بك في مشروع Codex
      </h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "500px" }}>
        هذا المشروع تم إنشاؤه باستخدام <strong>Next.js</strong> وتم نشره على{" "}
        <strong>Vercel</strong> بنجاح.
      </p>
    </main>
  );
}
