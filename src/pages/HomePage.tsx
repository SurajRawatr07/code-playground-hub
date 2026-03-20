import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SearchBar } from "@/components/SearchBar";
import { CategoryTabs } from "@/components/CategoryTabs";
import { LanguageGrid } from "@/components/LanguageGrid";
import { languages, Language } from "@/lib/languages";

const HomePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return languages.filter((lang) => {
      const matchesSearch = lang.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || lang.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const handleSelect = (lang: Language) => {
    navigate(`/editor/${lang.id}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <SearchBar value={search} onChange={setSearch} />
      <CategoryTabs active={category} onChange={setCategory} />
      <main className="mx-auto max-w-5xl px-4 pb-16">
        <LanguageGrid languages={filtered} onSelect={handleSelect} />
      </main>
    </div>
  );
};

export default HomePage;
