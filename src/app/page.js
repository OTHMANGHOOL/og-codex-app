import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.imageContainer}>
        <Image 
          src="/next.svg" 
          alt="شعار Next.js" 
          width={200} 
          height={50}
          priority={true} // Load immediately as it's above the fold
          className={styles.logo}
        />
      </div>
      
      <div className={styles.content}>
        <h1 className={styles.title}>
          مرحباً بك في مشروع Codex
        </h1>
        <p className={styles.description}>
          هذا المشروع تم إنشاؤه باستخدام <strong>Next.js</strong> وتم نشره على{" "}
          <strong>Vercel</strong> بنجاح. تم تحسينه للأداء والسرعة.
        </p>
      </div>
    </main>
  );
}
