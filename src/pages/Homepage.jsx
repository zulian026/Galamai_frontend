// src/pages/HomePage.jsx
import React from "react";
import Hero from "../components/sections/Hero";
import LayananUtama from "../components/sections/Service";
import AboutSection from "../components/sections/About";
import NewsSection from "../components/sections/News";
import ArticleSection from "../components/sections/Article";
import FaqSection from "../components/sections/Faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LayananUtama />
      <AboutSection />
      <NewsSection />
      <ArticleSection />
      <FaqSection />
    </>
  );
}
