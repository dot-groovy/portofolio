import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "About me and my path in technology.",
};

/**
 * Página About — breve introdução pessoal.
 */
export default function AboutPage() {
  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content about-page fade-in">
        <Link href="/" className="project-detail-back">
          &larr; back
        </Link>
        <p className="site-meta about-location">Location: Portugal</p>
        <p className="about-text">
          Since childhood, I have been curious about the world of technology and
          its potential to transform the world and make our daily lives easier.
          Whenever something new emerged, I would seek to understand how it
          worked and how I could use it to solve problems and find better
          solutions. When I started studying programming and developing my own
          projects, that curiosity grew into an even greater passion for
          learning, creating, and exploring new possibilities through
          technology.
        </p>
      </main>
      <Footer />
    </div>
  );
}
