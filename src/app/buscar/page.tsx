"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Search as SearchIcon, Filter, MapPin } from "lucide-react";

// You might want to define a type for your search results
interface CompanionResult {
  id: string;
  name: string;
  location: string;
  price_range: string;
  // Add other relevant fields
}

export default function SearchPage() {
  const [filters, setFilters] = useState({
    location: "",
    ageRange: [18, 50],
    priceRange: [100, 1000],
    // Add other filters as needed
  });
  const [results, setResults] = useState<CompanionResult[]>([]); // Typed results
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    // Replace with your actual API call logic
    // For example, fetch('/api/search', { method: 'POST', body: JSON.stringify(filters) })
    //   .then(res => res.json())
    //   .then(data => setResults(data))
    //   .catch(err => console.error(err))
    //   .finally(() => setLoading(false));
    console.log("Searching with filters:", filters);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Example results (replace with actual data fetching)
    setResults([
      { id: "1", name: "Sofia Elegance", location: "São Paulo, SP", price_range: "R$250-R$400" },
      { id: "2", name: "Laura VIP", location: "Rio de Janeiro, RJ", price_range: "R$300-R$500" },
    ]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-rose-50 pt-24">
      <main className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar acompanhantes..."
                className="pl-10"
                // value={searchTerm} // If you want to control the input
                // onChange={(e) => setSearchTerm(e.target.value)} // If you want to control the input
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Cidade"
                  className="pl-10"
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Faixa Etária: {filters.ageRange[0]} - {filters.ageRange[1]} anos</Label>
              <Slider
                defaultValue={filters.ageRange}
                min={18}
                max={50}
                step={1}
                className="py-4"
                onValueChange={(value) => handleFilterChange("ageRange", value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Faixa de Preço: R$ {filters.priceRange[0]} - R$ {filters.priceRange[1]}</Label>
              <Slider
                defaultValue={filters.priceRange}
                min={100}
                max={1000}
                step={50}
                className="py-4"
                onValueChange={(value) => handleFilterChange("priceRange", value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Outros Filtros</Label>
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Mais Filtros
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <p>Carregando resultados...</p>
          ) : results.length > 0 ? (
            results.map((result) => (
              <div key={result.id} className="bg-card/50 backdrop-blur-lg border border-border/30 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-foreground">{result.name}</h3>
                <p className="text-muted-foreground">{result.location}</p>
                <p className="text-primary font-medium">{result.price_range}</p>
                {/* Add more details or a link to the profile page */}
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground col-span-full">
              Nenhum resultado encontrado. Tente ajustar seus filtros.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

