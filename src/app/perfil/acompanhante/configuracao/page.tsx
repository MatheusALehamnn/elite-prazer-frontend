"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  Upload, MapPin, DollarSign, Check, Calendar, Clock, Eye, Shield,
  UserCircle, Mail, Lock, Phone, Briefcase, Palette, MessageSquare,
  Info, AlertTriangle, Trash2, Edit3, PlusCircle, MinusCircle,
  ArrowLeft, Camera, X
} from "lucide-react";

const STEPS = [
  { id: "profile", name: "Perfil Básico", icon: UserCircle },
  { id: "photos", name: "Fotos", icon: Camera },
  { id: "services", name: "Serviços", icon: Briefcase },
  { id: "pricing", name: "Preços", icon: DollarSign },
  { id: "availability", name: "Disponibilidade", icon: Calendar },
  { id: "verification", name: "Verificação", icon: Shield },
  { id: "review", name: "Revisão", icon: Check },
];

const SERVICE_CATEGORIES = {
  essenciais: [
    "Acompanhamento em eventos sociais",
    "Jantares românticos",
    "Viagens",
    "Conversa agradável",
  ],
  sensuais: [
    "Massagem sensual",
    "Striptease",
    "Dominação & Submissão (leve)",
    "Fetiches específicos (a combinar)",
  ],
  experiencias: [
    "Guia turístico(a) VIP",
    "Parceria para esportes ou hobbies",
    "Ensino de habilidades (dança, idiomas, etc.)",
  ],
};

const TIME_SLOTS = [
  { id: "morning", label: "Manhã", hours: "08:00 - 12:00" },
  { id: "afternoon", label: "Tarde", hours: "12:00 - 18:00" },
  { id: "evening", label: "Noite", hours: "18:00 - 00:00" },
  { id: "night", label: "Madrugada", hours: "00:00 - 06:00" },
];

export default function CompanionProfileSetupPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    headline: "",
    description: "",
    location: "",
    age: "",
    height: "",
    weight: "",
    ethnicity: "",
    languages: [],
    photos: [], // Array of File objects
    photoUrls: [], // Array of strings (URLs for display/existing)
    photoPreviews: [], // Array of strings (data URLs for preview)
    services: [],
    pricing: {
      hour: "",
      twoHours: "",
      overnight: "",
      weekend: "",
      travel: "",
    },
    availability: {},
    contact_phone: "",
    social_media: {},
    payment_methods: [],
  });

  // Redirect if not logged in or not a companion (or not setting up)
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/"); // Or to a login page
    }
    // TODO: Add logic to check if user is companion and needs setup
    // If profile already exists and is complete, maybe redirect to dashboard
  }, [user, authLoading, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePricingChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [name]: value ? parseInt(value) : "",
      }
    }));
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleTimeSlotToggle = (date, slotId) => {
    setFormData(prev => {
      const newAvailability = { ...prev.availability };
      if (!newAvailability[date]) {
        newAvailability[date] = {};
      }
      newAvailability[date][slotId] = !newAvailability[date][slotId];
      return { ...prev, availability: newAvailability };
    });
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const newPhotos = filesArray.slice(0, 12 - formData.photos.length); // Limit to 12 total

      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos],
        photoPreviews: [
          ...prev.photoPreviews,
          ...newPhotos.map(file => URL.createObjectURL(file))
        ]
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
      photoPreviews: prev.photoPreviews.filter((_, i) => i !== index),
    }));
  };

  const nextStep = () => {
    // Add validation logic here if needed for current step
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!user) {
      toast({ title: "Erro", description: "Você precisa estar logado para criar um perfil.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      // 1. Insert/Update companion basic info
      const { data: companionData, error: companionError } = await supabase
        .from("companions")
        .upsert({
          id: user.id, // Assuming user.id is the foreign key to users table
          user_id: user.id,
          name: formData.name,
          headline: formData.headline,
          description: formData.description,
          location: formData.location,
          age: parseInt(formData.age) || null,
          height: parseInt(formData.height) || null,
          weight: parseInt(formData.weight) || null,
          ethnicity: formData.ethnicity,
          languages: formData.languages.filter(lang => lang.trim() !== ""),
          price_range: formData.pricing,
          services: formData.services,
          contact_phone: formData.contact_phone,
          social_media: formData.social_media,
          payment_methods: formData.payment_methods,
          // status will be 'pending' by default or by a trigger
        })
        .select()
        .single();

      if (companionError) throw companionError;
      if (!companionData) throw new Error("Failed to save companion data.");

      // 2. Upload photos to storage and save URLs
      const uploadedPhotoUrls = [];
      for (const photoFile of formData.photos) {
        const fileName = `${user.id}/${Date.now()}_${photoFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("companion-photos") // Ensure this bucket exists and has proper policies
          .upload(fileName, photoFile);
        
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("companion-photos").getPublicUrl(fileName);
        uploadedPhotoUrls.push({ 
          companion_id: companionData.id, 
          url: urlData.publicUrl,
          // Determine is_primary based on order or a specific UI element
          is_primary: formData.photos.indexOf(photoFile) === 0, // Example: first uploaded is primary
          is_premium: formData.photos.indexOf(photoFile) >= 4 // Example: first 4 are free, rest are premium
        });
      }

      if (uploadedPhotoUrls.length > 0) {
        const { error: photoDbError } = await supabase.from("photos").insert(uploadedPhotoUrls);
        if (photoDbError) throw photoDbError;
      }
      
      // 3. Save availability
      const availabilityToInsert = [];
      for (const date in formData.availability) {
        for (const slotId in formData.availability[date]) {
          if (formData.availability[date][slotId]) {
            availabilityToInsert.push({
              companion_id: companionData.id,
              date: date,
              time_slot_id: slotId, // Assuming slotId matches your DB schema for time slots
              is_available: true
            });
          }
        }
      }
      if (availabilityToInsert.length > 0) {
        const { error: availabilityError } = await supabase.from("availability").insert(availabilityToInsert);
        if (availabilityError) throw availabilityError;
      }

      toast({
        title: "Perfil Atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
      router.push(`/profile/${user.id}`); // Or to a dashboard page

    } catch (error: any) {
      console.error("Error submitting profile:", error);
      toast({
        title: "Erro ao Salvar",
        description: error.message || "Não foi possível salvar seu perfil. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">Carregando...</div>
    );
  }

  if (!user) {
    // This should ideally be handled by a route guard or redirect in _app or middleware
    // For now, just show a message or redirect from here.
    // router.push('/login'); // Or show a login prompt
    return (
      <div className="flex justify-center items-center h-screen">Por favor, faça login para continuar.</div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Perfil Básico
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Artístico (Público)</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Como você gostaria de ser chamada" />
            </div>
            <div>
              <Label htmlFor="headline">Título do Perfil (Curto e chamativo)</Label>
              <Input id="headline" name="headline" value={formData.headline} onChange={handleInputChange} placeholder="Ex: Sua companhia ideal para momentos inesquecíveis" />
            </div>
            <div>
              <Label htmlFor="description">Descrição Detalhada</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Fale sobre você, seus interesses, o que você oferece..." rows={5} />
            </div>
            <div>
              <Label htmlFor="location">Localização (Cidade e Estado)</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleInputChange} placeholder="Ex: São Paulo, SP" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Idade</Label>
                <Input id="age" name="age" type="number" value={formData.age} onChange={handleInputChange} placeholder="Sua idade" />
              </div>
              <div>
                <Label htmlFor="height">Altura (cm)</Label>
                <Input id="height" name="height" type="number" value={formData.height} onChange={handleInputChange} placeholder="Ex: 170" />
              </div>
            </div>
            <div>
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input id="weight" name="weight" type="number" value={formData.weight} onChange={handleInputChange} placeholder="Ex: 60" />
            </div>
            <div>
              <Label htmlFor="ethnicity">Etnia</Label>
              <Input id="ethnicity" name="ethnicity" value={formData.ethnicity} onChange={handleInputChange} placeholder="Ex: Branca, Morena, Negra, Asiática, etc." />
            </div>
            <div>
              <Label htmlFor="languages">Idiomas (separados por vírgula)</Label>
              <Input id="languages" name="languages" value={formData.languages.join(', ')} onChange={(e) => setFormData(prev => ({...prev, languages: e.target.value.split(',').map(lang => lang.trim())}))} placeholder="Ex: Português, Inglês, Espanhol" />
            </div>
          </div>
        );
      case 1: // Fotos
        return (
          <div className="space-y-4">
            <Label>Fotos do Perfil (Máx. 12)</Label>
            <p className="text-sm text-muted-foreground">
              A primeira foto será sua foto principal. As 4 primeiras são públicas. As demais serão premium e visíveis apenas para assinantes.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {formData.photoPreviews.map((previewUrl, index) => (
                <div key={index} className="relative aspect-square border rounded-lg overflow-hidden">
                  <img src={previewUrl} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {index === 0 && <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5">Principal</div>}
                  {index > 0 && index < 4 && <div className="absolute bottom-0 left-0 right-0 bg-black/30 text-white text-xs text-center py-0.5">Pública</div>}
                  {index >= 4 && <div className="absolute bottom-0 left-0 right-0 bg-primary/70 text-primary-foreground text-xs text-center py-0.5">Premium</div>}
                </div>
              ))}
              {formData.photos.length < 12 && (
                <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/30 cursor-pointer">
                  <Upload className="h-8 w-8 mb-2" />
                  <span>Adicionar Fotos</span>
                  <input type="file" multiple accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              )}
            </div>
            {formData.photos.length > 0 && <p className="text-xs text-muted-foreground">Dica: Use fotos de alta qualidade e que mostrem bem você. A primeira foto é a mais importante!</p>}
          </div>
        );
      case 2: // Serviços
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground">Serviços Principais</h3>
              <p className="text-sm text-muted-foreground">Selecione os serviços que você oferece. Seja clara e honesta.</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(SERVICE_CATEGORIES).map(([category, services]) => (
                  <div key={category}>
                    <h4 className="font-semibold mb-2 capitalize text-foreground/80">{category.replace("_", " ")}</h4>
                    <div className="space-y-2">
                      {services.map((service) => (
                        <div key={service} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`service-${service}`}
                            checked={formData.services.includes(service)}
                            onChange={() => handleServiceToggle(service)}
                            className="mr-2 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <label htmlFor={`service-${service}`} className="text-sm text-muted-foreground">
                            {service}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="services_details">Detalhes Adicionais sobre Serviços (Opcional)</Label>
              <Textarea 
                id="services_details" 
                name="services_details" 
                value={formData.services_details || ""} 
                onChange={handleInputChange} 
                placeholder="Ex: Atendo em local próprio, aceito viagens para outras cidades, etc."
              />
            </div>
          </div>
        );
      case 3: // Preços
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-medium">Estrutura de Preços</Label>
              <p className="text-sm text-muted-foreground">Defina seus preços para diferentes durações. Seja transparente.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price_hour">Preço por Hora (R$)</Label>
                <Input id="price_hour" name="hour" type="number" value={formData.pricing.hour} onChange={handlePricingChange} placeholder="Ex: 250" />
              </div>
              <div>
                <Label htmlFor="price_twoHours">Preço por 2 Horas (R$)</Label>
                <Input id="price_twoHours" name="twoHours" type="number" value={formData.pricing.twoHours} onChange={handlePricingChange} placeholder="Ex: 450" />
              </div>
              <div>
                <Label htmlFor="price_overnight">Pernoite (12h) (R$)</Label>
                <Input id="price_overnight" name="overnight" type="number" value={formData.pricing.overnight} onChange={handlePricingChange} placeholder="Ex: 1200" />
              </div>
              <div>
                <Label htmlFor="price_weekend">Final de Semana (R$)</Label>
                <Input id="price_weekend" name="weekend" type="number" value={formData.pricing.weekend} onChange={handlePricingChange} placeholder="Ex: 2000 (Sexta a Domingo)" />
              </div>
            </div>
            <div>
              <Label htmlFor="price_travel">Taxa de Deslocamento (se aplicável)</Label>
              <Input id="price_travel" name="travel" type="number" value={formData.pricing.travel} onChange={handlePricingChange} placeholder="Ex: 100 (para cidades vizinhas)" />
            </div>
            <div>
              <Label htmlFor="payment_methods">Formas de Pagamento Aceitas</Label>
              <Input id="payment_methods" name="payment_methods" value={formData.payment_methods.join(', ')} onChange={(e) => setFormData(prev => ({...prev, payment_methods: e.target.value.split(',').map(pm => pm.trim())}))} placeholder="Ex: PIX, Dinheiro, Cartão de Crédito" />
              <p className="text-xs text-muted-foreground mt-1">Separe por vírgulas. Ex: PIX, Dinheiro, Cartão de Débito</p>
            </div>
          </div>
        );
      case 4: // Disponibilidade
        return (
          <div className="space-y-6">
            <Label className="text-lg font-medium">Defina sua Disponibilidade Semanal</Label>
            <p className="text-sm text-muted-foreground">
              Marque os horários em que você geralmente está disponível. Clientes poderão solicitar horários dentro da sua disponibilidade.
            </p>
            {/* Simplified example. A more complex calendar/scheduler might be needed */}
            {['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'].map(day => (
              <div key={day}>
                <h4 className="font-medium capitalize">{day}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                  {TIME_SLOTS.map(slot => (
                    <Button
                      key={slot.id}
                      variant={formData.availability[day]?.[slot.id] ? "default" : "outline"}
                      onClick={() => {
                        const dayAvailability = formData.availability[day] || {};
                        setFormData(prev => ({
                          ...prev,
                          availability: {
                            ...prev.availability,
                            [day]: {
                              ...dayAvailability,
                              [slot.id]: !dayAvailability[slot.id]
                            }
                          }
                        }))
                      }}
                      className="h-auto py-2 text-left"
                    >
                      <div className="text-xs">
                        <div>{slot.label}</div>
                        <div className="text-muted-foreground/80">{slot.hours}</div>
                      </div>
                      {formData.availability[day]?.[slot.id] && <Check className="ml-auto h-4 w-4" />}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <Label htmlFor="availability_notes">Notas sobre Disponibilidade (Opcional)</Label>
              <Textarea id="availability_notes" name="availability_notes" value={formData.availability_notes || ""} onChange={handleInputChange} placeholder="Ex: Flexibilidade para horários noturnos, disponibilidade para viagens, etc." />
            </div>
          </div>
        );
      case 5: // Verificação
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Verificação de Identidade</h3>
            <p className="text-sm text-muted-foreground">
              Para garantir a segurança e autenticidade da plataforma, solicitamos o envio de um documento de identificação com foto e uma selfie segurando este documento.
            </p>
            <div className="space-y-2">
              <Label htmlFor="document">Documento com Foto (Frente e Verso)</Label>
              <Input type="file" id="document" name="document" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="selfie">Selfie segurando o Documento</Label>
              <Input type="file" id="selfie" name="selfie" />
            </div>
            <div className="flex items-start space-x-2 pt-2">
              <input type="checkbox" id="terms-verification" className="mt-1" />
              <label htmlFor="terms-verification" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Declaro que as informações são verdadeiras e os documentos são meus.
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Seus documentos serão analisados por nossa equipe e não serão compartilhados com terceiros, exceto por exigência legal.
            </p>
          </div>
        );
      case 6: // Revisão e Envio
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Revise suas Informações</h3>
            <p className="text-sm text-muted-foreground">
              Confira todos os dados preenchidos antes de enviar seu perfil para análise. Após o envio, algumas informações só poderão ser alteradas através do suporte.
            </p>
            {/* TODO: Display a summary of the form data here */}
            <div className="border rounded-lg p-4 space-y-2 bg-muted/20">
              <h4 className="font-semibold">Perfil Básico</h4>
              <p className="text-sm"><strong>Nome:</strong> {formData.name || "Não informado"}</p>
              <p className="text-sm"><strong>Título:</strong> {formData.headline || "Não informado"}</p>
              <p className="text-sm"><strong>Descrição:</strong> {formData.description || "Não informado"}</p>
              <p className="text-sm"><strong>Localização:</strong> {formData.location || "Não informado"}</p>
              <p className="text-sm"><strong>Idade:</strong> {formData.age || "Não informado"}</p>
              <p className="text-sm"><strong>Altura:</strong> {formData.height ? formData.height + " cm" : "Não informado"}</p>
              <p className="text-sm"><strong>Peso:</strong> {formData.weight ? formData.weight + " kg" : "Não informado"}</p>
              <p className="text-sm"><strong>Etnia:</strong> {formData.ethnicity || "Não informado"}</p>
              <p className="text-sm"><strong>Idiomas:</strong> {formData.languages.join(", ") || "Não informado"}</p>
            </div>
            <div className="border rounded-lg p-4 space-y-2 bg-muted/20">
              <h4 className="font-semibold">Fotos</h4>
              {formData.photoPreviews.length > 0 ? (
                <p className="text-sm">{formData.photoPreviews.length} fotos selecionadas.</p>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma foto adicionada.</p>
              )}
            </div>
            <div className="border rounded-lg p-4 space-y-2 bg-muted/20">
              <h4 className="font-semibold">Serviços</h4>
              {formData.services.length > 0 ? (
                <ul className="list-disc list-inside text-sm">
                  {formData.services.map(s => <li key={s}>{s}</li>)}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum serviço selecionado.</p>
              )}
              {formData.services_details && <p className="text-sm mt-1"><strong>Detalhes:</strong> {formData.services_details}</p>}
            </div>
            <div className="border rounded-lg p-4 space-y-2 bg-muted/20">
              <h4 className="font-semibold">Preços</h4>
              <p className="text-sm"><strong>1 Hora:</strong> R$ {formData.pricing.hour || "N/A"}</p>
              <p className="text-sm"><strong>2 Horas:</strong> R$ {formData.pricing.twoHours || "N/A"}</p>
              <p className="text-sm"><strong>Pernoite:</strong> R$ {formData.pricing.overnight || "N/A"}</p>
              <p className="text-sm"><strong>Fim de Semana:</strong> R$ {formData.pricing.weekend || "N/A"}</p>
              <p className="text-sm"><strong>Taxa de Deslocamento:</strong> R$ {formData.pricing.travel || "N/A"}</p>
              <p className="text-sm"><strong>Formas de Pagamento:</strong> {formData.payment_methods.join(", ") || "Não informado"}</p>
            </div>
            <div className="border rounded-lg p-4 space-y-2 bg-muted/20">
              <h4 className="font-semibold">Disponibilidade</h4>
              {/* TODO: Display a summary of availability. This can be complex. */} 
              <p className="text-sm text-muted-foreground">A disponibilidade será confirmada após a aprovação do perfil.</p>
              {formData.availability_notes && <p className="text-sm mt-1"><strong>Notas:</strong> {formData.availability_notes}</p>}
            </div>
            <div className="border rounded-lg p-4 space-y-2 bg-muted/20">
              <h4 className="font-semibold">Informações de Contato (Não Públicas)</h4>
              <p className="text-sm"><strong>Telefone para Contato (interno):</strong> {formData.contact_phone || "Não informado"}</p>
              {/* TODO: Add other contact fields if necessary */}
            </div>

            <Button onClick={handleSubmit} disabled={isLoading} className="w-full premium-gradient">
              {isLoading ? "Enviando..." : "Enviar para Análise"}
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    (
      <div className="min-h-screen bg-gradient-to-b from-background to-rose-100 dark:to-rose-900/30 pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-card/80 backdrop-blur-lg border border-border/30 rounded-xl shadow-2xl p-6 md:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-center text-gradient mb-2">Complete seu Perfil de Acompanhante</h2>
              <p className="text-center text-muted-foreground">Siga os passos para criar um perfil atraente e seguro.</p>
            </div>

            {/* Stepper */} 
            <div className="mb-8 flex justify-between items-center">
              {STEPS.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className={`flex flex-col items-center ${currentStep >= index ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep > index ? 'bg-primary text-primary-foreground border-primary' : currentStep === index ? 'border-primary' : 'border-border'}`}>
                      {currentStep > index ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                    </div>
                    <p className={`mt-2 text-xs text-center ${currentStep >= index ? 'font-semibold' : ''}`}>{step.name}</p>
                  </div>
                  {index < STEPS.length - 1 && <div className={`flex-1 h-1 ${currentStep > index ? 'bg-primary' : 'bg-border'} mx-2`}></div>}
                </React.Fragment>
              ))}
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              {renderStepContent()}
              <div className="mt-8 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={prevStep} 
                  disabled={currentStep === 0 || isLoading}
                >
                  Anterior
                </Button>
                {currentStep < STEPS.length - 1 ? (
                  <Button onClick={nextStep} disabled={isLoading} className="premium-gradient">
                    Próximo
                  </Button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
}

