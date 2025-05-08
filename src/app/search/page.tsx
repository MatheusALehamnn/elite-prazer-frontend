"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search as SearchIcon, Frown, Loader2, MapPin, DollarSign, Filter as FilterIcon, ListFilter, Star, Eye, MessageSquare, Heart, ChevronDown, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { CompanionCard } from "@/components/companion/CompanionCard"; // Assuming this is the correct path

// Types (can be moved to a types.ts file)
interface Companion {
  id: string;
  name: string;
  location: string;
  age: number | null;
  price_per_hour: number | null;
  description: string | null;
  photos: { url: string; is_primary: boolean }[];
  services: string[];
  // Calculated or joined fields
  average_rating?: number | null;
  is_favorite?: boolean;
  // Add other fields as needed by CompanionCard
}

interface Filters {
  searchTerm: string;
  location: string;
  ageRange: [number, number];
  priceRange: [number, number];
  services: string[];
  sortBy: string;
}

const initialFilters: Filters = {
  searchTerm: "",
  location: "",
  ageRange: [18, 60],
  priceRange: [50, 500],
  services: [],
  sortBy: "created_at_desc",
};

const allServicesList = ["Massagem Relaxante", "Viagens", "Eventos Sociais", "Jantar Romântico", "Show Erótico", "Fetiches Específicos"]; // Example services
const allLocationsList = ["São Paulo, SP", "Rio de Janeiro, RJ", "Belo Horizonte, MG", "Curitiba, PR", "Porto Alegre, RS"]; // Example locations

export default function SearchPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [results, setResults] = useState<Companion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const { toast } = useToast(); // Assuming useToast is available from shadcn/ui or similar

  const handleFilterChange = useCallback((filterName: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  }, []);

  const applyFilters = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("companions") // Assuming your table is named 'companions'
        .select(`
          id, name, location, age, price_per_hour, description, 
          photos (url, is_primary),
          services,
          user_reviews ( rating )
        `)
        .eq("status", "approved") // Only show approved companions
        .eq("verified", true); // And verified ones

      if (filters.searchTerm) {
        query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }
      if (filters.location) {
        query = query.eq("location", filters.location);
      }
      if (filters.ageRange) {
        query = query.gte("age", filters.ageRange[0]).lte("age", filters.ageRange[1]);
      }
      if (filters.priceRange) {
        query = query.gte("price_per_hour", filters.priceRange[0]).lte("price_per_hour", filters.priceRange[1]);
      }
      if (filters.services.length > 0) {
        // This assumes services are stored in a way that can be queried like this.
        // If services is an array column, you might need to use .contains or .overlaps
        query = query.overlaps("services", filters.services); 
      }

      // Sorting
      if (filters.sortBy === "rating_desc") {
        // This requires a way to sort by average rating. 
        // If you have an 'average_rating' column, use it.
        // Otherwise, this might need a more complex query or a database function.
        // For simplicity, let's assume an 'average_rating' column exists or this part is handled differently.
        // query = query.order('average_rating', { ascending: false, nullsLast: true });
        console.warn("Sorting by rating_desc requires an 'average_rating' column or a database function.")
      } else if (filters.sortBy === "price_asc") {
        query = query.order("price_per_hour", { ascending: true });
      } else if (filters.sortBy === "price_desc") {
        query = query.order("price_per_hour", { ascending: false });
      } else {
        // Default sort by creation date or relevance (if your DB supports it)
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query.limit(20); // Add pagination later

      if (error) {
        throw error;
      }

      const processedResults = data ? data.map(c => ({
        ...c,
        // @ts-ignore
        average_rating: c.user_reviews?.length > 0 ? c.user_reviews.reduce((acc, r) => acc + r.rating, 0) / c.user_reviews.length : null,
        // @ts-ignore
        photos: c.photos || [],
        // @ts-ignore
        services: c.services || [],
      })) : [];

      setResults(processedResults as Companion[]);

    } catch (error: any) {
      console.error("Error fetching companions:", error);
      toast({
        title: "Erro ao buscar",
        description: error.message || "Não foi possível carregar os resultados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, toast]);

  // Load initial results or when filters change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Update filters from URL on initial load
  useEffect(() => {
    const newFilters: Partial<Filters> = {};
    if (searchParams.get("q")) newFilters.searchTerm = searchParams.get("q")!;
    if (searchParams.get("location")) newFilters.location = searchParams.get("location")!;
    // ... parse other filters from URL ...
    if (Object.keys(newFilters).length > 0) {
      setFilters(prev => ({...prev, ...newFilters}));
    }
  }, [searchParams]);

  // Update URL when filters change
  const handleFilterAndUrlUpdate = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.searchTerm) params.set("q", filters.searchTerm);
    if (filters.location) params.set("location", filters.location);
    // ... set other filters ...
    router.push(`/search?${params.toString()}`, { scroll: false });
    applyFilters();
  }, [filters, router, applyFilters]);


  return (
    <div className="w-full">
      <div className="bg-card/80 backdrop-blur-md sticky top-0 z-10 shadow-sm pt-4 pb-2 mb-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Buscar por nome, especialidade..."
                className="h-12 text-base flex-grow"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFilterAndUrlUpdate()}
              />
              <Button onClick={handleFilterAndUrlUpdate} className="h-12 premium-gradient px-6" disabled={isLoading}>
                <SearchIcon className="mr-2 h-5 w-5" />
                {isLoading ? "Buscando..." : "Buscar"}
              </Button>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-12 lg:hidden">
                <FilterIcon className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0}}
                animate={{ height: 'auto', opacity: 1}}
                exit={{ height: 0, opacity: 0}}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 overflow-hidden"
              >
                <div>
                  <Label htmlFor="location-filter" className="text-sm font-medium text-muted-foreground">Localização</Label>
                  <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
                    <SelectTrigger id="location-filter">
                      <SelectValue placeholder="Todas as cidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as cidades</SelectItem>
                      {allLocationsList.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="age-range" className="text-sm font-medium text-muted-foreground">Faixa Etária: {filters.ageRange[0]} - {filters.ageRange[1]} anos</Label>
                  <Slider
                    id="age-range"
                    min={18}
                    max={70}
                    step={1}
                    value={filters.ageRange}
                    onValueChange={(value) => handleFilterChange("ageRange", value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="price-range" className="text-sm font-medium text-muted-foreground">Preço/h: R${filters.priceRange[0]} - R${filters.priceRange[1]}</Label>
                  <Slider
                    id="price-range"
                    min={50}
                    max={1000}
                    step={10}
                    value={filters.priceRange}
                    onValueChange={(value) => handleFilterChange("priceRange", value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Serviços</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {filters.services.length > 0 ? `${filters.services.length} selecionados` : "Selecionar serviços"}
                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 max-h-80 overflow-y-auto">
                      <DropdownMenuLabel>Serviços Oferecidos</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {allServicesList.map((service) => (
                        <DropdownMenuCheckboxItem
                          key={service}
                          checked={filters.services.includes(service)}
                          onCheckedChange={(checked) => {
                            const newServices = checked
                              ? [...filters.services, service]
                              : filters.services.filter((s) => s !== service);
                            handleFilterChange("services", newServices);
                          }}
                        >
                          {service}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-end gap-2 pt-2 border-t border-border/20 mt-2">
                    <Button variant="ghost" onClick={() => {
                        setFilters(initialFilters);
                        // Also clear URL params if they were set by filters
                        router.push('/search', { scroll: false });
                        // applyFilters will be called by useEffect due to filters change
                    }} className="text-muted-foreground">
                        Limpar Filtros
                    </Button>
                    <Button onClick={handleFilterAndUrlUpdate} className="premium-gradient">
                        <FilterIcon className="mr-2 h-4 w-4" />
                        Aplicar Filtros
                    </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 pb-12">
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="ml-4 text-muted-foreground">Buscando acompanhantes...</p>
          </div>
        )}
        {!isLoading && results.length === 0 && (
          <div className="text-center py-12">
            <Frown className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
            <h2 className="text-2xl font-semibold text-muted-foreground mb-2">Nenhum resultado encontrado</h2>
            <p className="text-muted-foreground">Tente ajustar seus filtros ou pesquisar por termos diferentes.</p>
          </div>
        )}
        {!isLoading && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {results.map((companion) => (
              // Assuming CompanionCard is correctly imported and can handle the companion data structure
              <CompanionCard key={companion.id} companion={companion as any} />
            ))}
          </div>
        )}
        {/* TODO: Add pagination if many results */}
      </div>
    </div>
  );
}

// Placeholder for DropdownMenu components if not already defined elsewhere
// This is just for the structure, actual implementation might be in ui/dropdown-menu.tsx
const DropdownMenu = ({children}: {children: React.ReactNode}) => <div className="relative inline-block text-left">{children}</div>;
const DropdownMenuTrigger = ({children, asChild}: {children: React.ReactNode, asChild?: boolean}) => <div className={asChild ? "" : "inline-flex rounded-md shadow-sm"}>{children}</div>;
const DropdownMenuContent = ({children, className}: {children: React.ReactNode, className?:string}) => <div className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-popover ring-1 ring-black ring-opacity-5 focus:outline-none z-10 ${className}`}>{children}</div>;
const DropdownMenuLabel = ({children}: {children: React.ReactNode}) => <div className="px-4 py-2 text-sm text-foreground font-semibold">{children}</div>;
const DropdownMenuSeparator = () => <hr className="my-1 border-border" />;
const DropdownMenuItem = ({children, onClick}: {children: React.ReactNode, onClick?: () => void}) => <button onClick={onClick} className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted focus:bg-muted focus:outline-none">{children}</button>;
const DropdownMenuCheckboxItem = ({ children, checked, onCheckedChange }: { children: React.ReactNode, checked: boolean, onCheckedChange: (checked: boolean) => void }) => (
    <label className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted focus:bg-muted focus:outline-none cursor-pointer">
        <input type="checkbox" className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary mr-2" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} />
        {children}
    </label>
);


