import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoryTabs } from "@/components/CategoryTabs";
import { LanguageGrid } from "@/components/LanguageGrid";
import { FeaturesSection } from "@/components/FeaturesSection";
import { LiveDemoSection } from "@/components/LiveDemoSection";
import { LanguagesTools } from "@/components/LanguagesTools";
import { TemplatesSection } from "@/components/TemplatesSection";
import { ThemePreviewSection } from "@/components/ThemePreviewSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { AuthCTASection } from "@/components/AuthCTASection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ResponsiveSection } from "@/components/ResponsiveSection";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { StatsSection } from "@/components/StatsSection";
import { Footer } from "@/components/Footer";
import { languages, Language } from "@/lib/languages";

const HomePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (debounceRef[0]) clearTimeout(debounceRef[0]);
    debounceRef[0] = setTimeout(() => setDebouncedSearch(value), 300);
  }, [debounceRef]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return languages.filter((lang) => {
      const matchesSearch =
        !q ||
        lang.name.toLowerCase().includes(q) ||
        lang.category.toLowerCase().includes(q);
      const matchesCategory = category === "All" || lang.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [debouncedSearch, category]);

  const handleSelect = (lang: Language) => {
    navigate(`/editor/${lang.id}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar searchQuery={search} onSearchChange={handleSearchChange} />
      <Hero />
      <CategoryTabs active={category} onChange={setCategory} />
      <main className="mx-auto max-w-6xl px-4 pb-20">
        <LanguageGrid languages={filtered} onSelect={handleSelect} />
      </main>
      <FeaturesSection />
      <LiveDemoSection />
      <LanguagesTools />
      <TemplatesSection />
      <ThemePreviewSection />
      <HowItWorksSection />
      <AuthCTASection />
      <TestimonialsSection />
      <ResponsiveSection />
      <WhyChooseUs />
      <StatsSection />
      <Footer />
    </div>
  );
};

export default HomePage;
