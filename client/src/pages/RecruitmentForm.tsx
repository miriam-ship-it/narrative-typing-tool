import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface FormData {
  // Personal Info
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  
  // Address
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Professional
  education: string;
  experience: string;
  languages: string;
  availability: string;
  
  // Typing Tool
  tt1Responses: Record<string, number>;
  tt2Responses: Record<string, number>;
  tt3Responses: number[];
  tt4Responses: number[];
  tt5Responses: Record<string, number>;
  tt6Responses: number[];
  tt7Responses: number[];
}

export default function RecruitmentForm() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 11; // 4 cadastro + 7 typing tool
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    education: "",
    experience: "",
    languages: "",
    availability: "",
    tt1Responses: {},
    tt2Responses: {},
    tt3Responses: [],
    tt4Responses: [],
    tt5Responses: {},
    tt6Responses: [],
    tt7Responses: [],
  });

  const submitMutation = trpc.recruitment.submit.useMutation({
    onSuccess: (data) => {
      toast.success("Formulário enviado com sucesso!");
      setLocation(`/resultado/${data.candidateId}`);
    },
    onError: (error) => {
      toast.error(`Erro ao enviar formulário: ${error.message}`);
    },
  });

  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    // Validate current step
    if (!validateStep(currentStep)) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Personal Info
        return !!(formData.fullName && formData.email && formData.phone && formData.dateOfBirth);
      case 2: // Address
        return !!(formData.address && formData.city && formData.state && formData.zipCode);
      case 3: // Professional
        return !!(formData.education && formData.experience && formData.languages && formData.availability);
      case 4: // TT1
        return Object.keys(formData.tt1Responses).length > 0;
      case 5: // TT2
        return Object.keys(formData.tt2Responses).length > 0;
      case 6: // TT3
        return formData.tt3Responses.length > 0;
      case 7: // TT4
        return formData.tt4Responses.length > 0;
      case 8: // TT5
        return Object.keys(formData.tt5Responses).length > 0;
      case 9: // TT6
        return formData.tt6Responses.length > 0;
      case 10: // TT7
        return formData.tt7Responses.length > 0;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    submitMutation.mutate(formData);
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container py-6">
          <img 
            src="/aponto-logo.png" 
            alt="Aponto Pesquisa" 
            className="h-12 object-contain"
          />
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Etapa {currentStep} de {totalSteps}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% concluído
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Form Content */}
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{getStepTitle(currentStep)}</CardTitle>
              <CardDescription>{getStepDescription(currentStep)}</CardDescription>
            </CardHeader>
            <CardContent>
              {renderStep(currentStep, formData, updateFormData)}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1 || submitMutation.isPending}
                >
                  Anterior
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={submitMutation.isPending}
                  className="bg-[#2570A7] hover:bg-[#1B5580]"
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : currentStep === totalSteps ? (
                    "Finalizar"
                  ) : (
                    "Próximo"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getStepTitle(step: number): string {
  const titles = [
    "Dados Pessoais",
    "Endereço",
    "Informações Profissionais",
    "TT1: Dispositivos de Jogo",
    "TT2: Gêneros Favoritos",
    "TT3: Tipos de Jogo",
    "TT4: Critérios para Novo Jogo",
    "TT5: Preferências Narrativas",
    "TT6: Importância em Jogos Narrativos",
    "TT7: Preferências Visuais e de Áudio",
  ];
  return titles[step - 1] || "";
}

function getStepDescription(step: number): string {
  const descriptions = [
    "Preencha seus dados pessoais básicos",
    "Informe seu endereço completo",
    "Conte-nos sobre sua formação e experiência",
    "Com que frequência você joga em cada dispositivo?",
    "Qual é sua opinião sobre os seguintes gêneros de jogos?",
    "Quais tipos de jogos você prefere?",
    "O que é mais importante ao começar um novo jogo?",
    "Quais são suas preferências em experiências narrativas?",
    "O que é mais importante em jogos com muita narrativa?",
    "O que é mais importante em termos visuais e de áudio?",
  ];
  return descriptions[step - 1] || "";
}

function renderStep(step: number, formData: FormData, updateFormData: (field: keyof FormData, value: any) => void) {
  switch (step) {
    case 1:
      return <PersonalInfoStep formData={formData} updateFormData={updateFormData} />;
    case 2:
      return <AddressStep formData={formData} updateFormData={updateFormData} />;
    case 3:
      return <ProfessionalStep formData={formData} updateFormData={updateFormData} />;
    case 4:
      return <TT1Step formData={formData} updateFormData={updateFormData} />;
    case 5:
      return <TT2Step formData={formData} updateFormData={updateFormData} />;
    case 6:
      return <TT3Step formData={formData} updateFormData={updateFormData} />;
    case 7:
      return <TT4Step formData={formData} updateFormData={updateFormData} />;
    case 8:
      return <TT5Step formData={formData} updateFormData={updateFormData} />;
    case 9:
      return <TT6Step formData={formData} updateFormData={updateFormData} />;
    case 10:
      return <TT7Step formData={formData} updateFormData={updateFormData} />;
    default:
      return null;
  }
}

// Step Components
function PersonalInfoStep({ formData, updateFormData }: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fullName">Nome Completo *</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => updateFormData("fullName", e.target.value)}
          placeholder="Digite seu nome completo"
        />
      </div>
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData("email", e.target.value)}
          placeholder="seu@email.com"
        />
      </div>
      <div>
        <Label htmlFor="phone">Telefone *</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => updateFormData("phone", e.target.value)}
          placeholder="(00) 00000-0000"
        />
      </div>
      <div>
        <Label htmlFor="dateOfBirth">Data de Nascimento *</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
        />
      </div>
    </div>
  );
}

function AddressStep({ formData, updateFormData }: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="address">Endereço *</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => updateFormData("address", e.target.value)}
          placeholder="Rua, número, complemento"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">Cidade *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => updateFormData("city", e.target.value)}
            placeholder="Cidade"
          />
        </div>
        <div>
          <Label htmlFor="state">Estado *</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => updateFormData("state", e.target.value)}
            placeholder="UF"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="zipCode">CEP *</Label>
        <Input
          id="zipCode"
          value={formData.zipCode}
          onChange={(e) => updateFormData("zipCode", e.target.value)}
          placeholder="00000-000"
        />
      </div>
    </div>
  );
}

function ProfessionalStep({ formData, updateFormData }: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="education">Escolaridade *</Label>
        <Input
          id="education"
          value={formData.education}
          onChange={(e) => updateFormData("education", e.target.value)}
          placeholder="Ex: Ensino Superior Completo"
        />
      </div>
      <div>
        <Label htmlFor="experience">Experiência Profissional *</Label>
        <Textarea
          id="experience"
          value={formData.experience}
          onChange={(e) => updateFormData("experience", e.target.value)}
          placeholder="Descreva sua experiência profissional"
          rows={4}
        />
      </div>
      <div>
        <Label htmlFor="languages">Idiomas *</Label>
        <Input
          id="languages"
          value={formData.languages}
          onChange={(e) => updateFormData("languages", e.target.value)}
          placeholder="Ex: Português (nativo), Inglês (fluente)"
        />
      </div>
      <div>
        <Label htmlFor="availability">Disponibilidade *</Label>
        <Input
          id="availability"
          value={formData.availability}
          onChange={(e) => updateFormData("availability", e.target.value)}
          placeholder="Ex: Imediata, 30 dias"
        />
      </div>
    </div>
  );
}

// Typing Tool Steps - Simplified versions
function TT1Step({ formData, updateFormData }: any) {
  const devices = [
    { key: "playstation5", label: "PlayStation 5" },
    { key: "playstation4", label: "PlayStation 4" },
    { key: "xboxSeriesXS", label: "Xbox Series X/S" },
    { key: "xboxOne", label: "Xbox One" },
    { key: "nintendoSwitch", label: "Nintendo Switch" },
    { key: "desktopLaptop", label: "Desktop/Laptop" },
    { key: "smartphone", label: "Smartphone" },
    { key: "tablet", label: "Tablet" },
    { key: "vrHeadset", label: "VR Headset" },
  ];

  const frequencies = [
    { value: 7, label: "Diário" },
    { value: 6, label: "Semanal" },
    { value: 5, label: "Algumas vezes por mês" },
    { value: 4, label: "Uma vez por mês" },
    { value: 3, label: "A cada poucos meses" },
    { value: 2, label: "A cada 6 meses" },
    { value: 1, label: "Nunca" },
  ];

  const handleChange = (device: string, value: number) => {
    const updated = { ...formData.tt1Responses, [device]: value };
    updateFormData("tt1Responses", updated);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Com que frequência você joga videogame em cada dispositivo?
      </p>
      {devices.map((device) => (
        <div key={device.key} className="space-y-2">
          <Label>{device.label}</Label>
          <select
            className="w-full p-2 border rounded-md"
            value={formData.tt1Responses[device.key] || ""}
            onChange={(e) => handleChange(device.key, Number(e.target.value))}
          >
            <option value="">Selecione...</option>
            {frequencies.map((freq) => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

function TT2Step({ formData, updateFormData }: any) {
  const genres = [
    { key: "actionAdventure", label: "Ação e Aventura" },
    { key: "actionRPG", label: "RPG de Ação" },
    { key: "battleRoyale", label: "Battle Royale" },
    { key: "construction", label: "Construção/Gestão" },
    { key: "cardGames", label: "Jogos de Cartas Digitais" },
    { key: "fighting", label: "Lutas" },
    { key: "horror", label: "Horror" },
    { key: "lifeSimulation", label: "Simulação de Vida" },
    { key: "mmo", label: "MMO" },
    { key: "moba", label: "MOBA" },
    { key: "monsterTaming", label: "Domar Monstros" },
    { key: "openWorldSandbox", label: "Mundo Aberto Sandbox" },
    { key: "partySocial", label: "Festa/Social" },
    { key: "platformer", label: "Plataforma" },
    { key: "puzzleCasual", label: "Quebra-cabeça/Casual" },
    { key: "racing", label: "Corridas" },
    { key: "rpg", label: "RPG" },
    { key: "shooter", label: "Jogos de Tiro" },
    { key: "sports", label: "Esportes" },
    { key: "strategy", label: "Estratégia" },
    { key: "survival", label: "Sobrevivência" },
    { key: "visualNovel", label: "Visual Novel" },
  ];

  const opinions = [
    { value: 5, label: "É meu gênero favorito" },
    { value: 4, label: "Eu gosto, mas não é o meu favorito" },
    { value: 3, label: "Eu gosto desse gênero" },
    { value: 2, label: "Eu não gosto desse gênero" },
    { value: 1, label: "Não conheço esse gênero" },
  ];

  const handleChange = (genre: string, value: number) => {
    const updated = { ...formData.tt2Responses, [genre]: value };
    updateFormData("tt2Responses", updated);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Qual é a sua opinião sobre os seguintes gêneros de jogos?
      </p>
      {genres.map((genre) => (
        <div key={genre.key} className="space-y-2">
          <Label>{genre.label}</Label>
          <select
            className="w-full p-2 border rounded-md"
            value={formData.tt2Responses[genre.key] || ""}
            onChange={(e) => handleChange(genre.key, Number(e.target.value))}
          >
            <option value="">Selecione...</option>
            {opinions.map((opinion) => (
              <option key={opinion.value} value={opinion.value}>
                {opinion.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

// Simplified remaining steps
function TT3Step({ formData, updateFormData }: any) {
  const gameTypes = [
    "História linear para um jogador",
    "Missões/fases para um jogador",
    "Sandbox/mundo aberto para um jogador",
    "PvP competitivo multiplayer",
    "Multiplayer cooperativo PvE",
    "Multiplayer PvEvP",
    "Multiplayer massivo online (MMO)",
  ];

  const handleToggle = (index: number) => {
    const current = formData.tt3Responses || [];
    const updated = current.includes(index)
      ? current.filter((i: number) => i !== index)
      : [...current, index];
    updateFormData("tt3Responses", updated);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Quais desses tipos de jogos você prefere? (Selecione até 3)
      </p>
      {gameTypes.map((type, index) => (
        <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={formData.tt3Responses.includes(index)}
            onChange={() => handleToggle(index)}
            disabled={formData.tt3Responses.length >= 3 && !formData.tt3Responses.includes(index)}
            className="w-4 h-4"
          />
          <span>{type}</span>
        </label>
      ))}
    </div>
  );
}

function TT4Step({ formData, updateFormData }: any) {
  const criteria = [
    "Como acho a história atraente",
    "Como acho os personagens atraentes",
    "A qualidade dos gráficos",
    "Como acho o estilo de arte atraente",
    "Se as mecânicas de jogo parecerem interessantes",
    "Se o jogo tiver sistemas de progressão interessantes",
    "Tem um modo de jogo para um jogador",
    "Possui modos de jogo multiplayer",
  ];

  const handleToggle = (index: number) => {
    const current = formData.tt4Responses || [];
    const updated = current.includes(index)
      ? current.filter((i: number) => i !== index)
      : [...current, index];
    updateFormData("tt4Responses", updated);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        O que é mais importante ao começar um novo jogo? (Selecione até 3)
      </p>
      {criteria.map((criterion, index) => (
        <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={formData.tt4Responses.includes(index)}
            onChange={() => handleToggle(index)}
            disabled={formData.tt4Responses.length >= 3 && !formData.tt4Responses.includes(index)}
            className="w-4 h-4"
          />
          <span>{criterion}</span>
        </label>
      ))}
    </div>
  );
}

function TT5Step({ formData, updateFormData }: any) {
  const preferences = [
    { key: "linear", labelA: "Progressão não linear da história", labelB: "Uma história linear" },
    { key: "unique", labelA: "Uma história única e completável", labelB: "Uma história com muita rejogabilidade" },
    { key: "updates", labelA: "Uma experiência de jogo única", labelB: "Atualizações contínuas e novo conteúdo" },
    { key: "focus", labelA: "Foca em uma única grande história", labelB: "Foca em múltiplos momentos menores" },
    { key: "change", labelA: "Uma história igual para todos", labelB: "Uma história que pode mudar" },
    { key: "tone", labelA: "Tom/cenário mais sombrio", labelB: "Tom/cenário mais leve" },
    { key: "gameplay", labelA: "Foca mais em contar uma história", labelB: "Foca mais em mecânicas/sistemas" },
    { key: "character", labelA: "Personagem pré-criado", labelB: "Personagem que você mesmo criou" },
  ];

  const handleChange = (key: string, value: number) => {
    const updated = { ...formData.tt5Responses, [key]: value };
    updateFormData("tt5Responses", updated);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600 mb-4">
        Para cada par de opções, indique sua preferência (0 = prefere A, 1 = prefere B)
      </p>
      {preferences.map((pref) => (
        <div key={pref.key} className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-gray-700">{pref.labelA}</div>
            <div className="text-gray-700">{pref.labelB}</div>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={pref.key}
                value="0"
                checked={formData.tt5Responses[pref.key] === 0}
                onChange={() => handleChange(pref.key, 0)}
              />
              <span>Prefiro A</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={pref.key}
                value="1"
                checked={formData.tt5Responses[pref.key] === 1}
                onChange={() => handleChange(pref.key, 1)}
              />
              <span>Prefiro B</span>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}

function TT6Step({ formData, updateFormData }: any) {
  const aspects = [
    "Uma história que desperta emoções fortes",
    "Uma história onde minhas escolhas têm consequências",
    "Uma história com momentos icônicos/memoráveis",
    "As motivações dos personagens são críveis/relacionáveis",
    "Personagens experimentam mudanças e crescimento",
    "Sistemas de jogabilidade que levam a cenários inesperados",
  ];

  const handleToggle = (index: number) => {
    const current = formData.tt6Responses || [];
    const updated = current.includes(index)
      ? current.filter((i: number) => i !== index)
      : [...current, index];
    updateFormData("tt6Responses", updated);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        O que é mais importante em jogos com muita narrativa? (Selecione até 3)
      </p>
      {aspects.map((aspect, index) => (
        <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={formData.tt6Responses.includes(index)}
            onChange={() => handleToggle(index)}
            disabled={formData.tt6Responses.length >= 3 && !formData.tt6Responses.includes(index)}
            className="w-4 h-4"
          />
          <span>{aspect}</span>
        </label>
      ))}
    </div>
  );
}

function TT7Step({ formData, updateFormData }: any) {
  const aspects = [
    "Qualidade dos gráficos",
    "Estilo artístico",
    "Cenário do jogo",
    "Estabilidade do jogo",
    "Qualidade da dublagem",
    "Inclusão de dublagem",
  ];

  const handleToggle = (index: number) => {
    const current = formData.tt7Responses || [];
    const updated = current.includes(index)
      ? current.filter((i: number) => i !== index)
      : [...current, index];
    updateFormData("tt7Responses", updated);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        O que é mais importante em termos visuais e de áudio? (Selecione até 3)
      </p>
      {aspects.map((aspect, index) => (
        <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={formData.tt7Responses.includes(index)}
            onChange={() => handleToggle(index)}
            disabled={formData.tt7Responses.length >= 3 && !formData.tt7Responses.includes(index)}
            className="w-4 h-4"
          />
          <span>{aspect}</span>
        </label>
      ))}
    </div>
  );
}
