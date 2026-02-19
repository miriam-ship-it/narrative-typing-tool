import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, CheckCircle2, TrendingUp, Briefcase } from "lucide-react";
import { PROFILE_DESCRIPTIONS } from "@shared/formTypes";

export default function Result() {
  const [, params] = useRoute("/resultado/:id");
  const [, setLocation] = useLocation();
  const candidateId = params?.id ? parseInt(params.id) : undefined;

  const { data: candidate, isLoading, error } = trpc.recruitment.getCandidateById.useQuery(
    { id: candidateId! },
    { enabled: !!candidateId }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2570A7]" />
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Erro</CardTitle>
            <CardDescription>Não foi possível carregar os resultados</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")} className="bg-[#2570A7] hover:bg-[#1B5580]">
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const profileInfo = PROFILE_DESCRIPTIONS[candidate.profileType];
  const scores = {
    Empath: parseFloat(candidate.empathScore),
    Pioneer: parseFloat(candidate.pioneerScore),
    Mechanist: parseFloat(candidate.mechanistScore),
    Collaborator: parseFloat(candidate.collaboratorScore),
    Nester: parseFloat(candidate.nesterScore),
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

      {/* Results */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Análise Concluída!
            </h1>
            <p className="text-lg text-gray-600">
              Obrigado por completar o questionário, {candidate.fullName}
            </p>
          </div>

          {/* Profile Result */}
          <Card className="mb-8 border-2 border-[#2570A7]">
            <CardHeader className="bg-[#2570A7] text-white">
              <CardTitle className="text-2xl">Seu Perfil: {profileInfo.name}</CardTitle>
              <CardDescription className="text-blue-100">
                Perfil comportamental identificado
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                {profileInfo.description}
              </p>
            </CardContent>
          </Card>

          {/* Scores */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-[#2570A7]" />
                <CardTitle>Scores por Perfil</CardTitle>
              </div>
              <CardDescription>
                Distribuição dos seus scores em cada perfil comportamental
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(scores).map(([profile, score]) => {
                  const isWinner = profile === candidate.profileType;
                  return (
                    <div key={profile} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`font-medium ${isWinner ? 'text-[#2570A7] font-bold' : 'text-gray-700'}`}>
                          {profile}
                          {isWinner && " ⭐"}
                        </span>
                        <span className="text-sm text-gray-600">
                          {score.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${isWinner ? 'bg-[#2570A7]' : 'bg-gray-400'}`}
                          style={{ width: `${(score / Math.max(...Object.values(scores))) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Characteristics */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-[#2570A7]" />
                <CardTitle>Características Principais</CardTitle>
              </div>
              <CardDescription>
                Traços comportamentais do seu perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {profileInfo.characteristics.map((characteristic, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-[#2570A7] mt-1">•</span>
                    <span className="text-gray-700">{characteristic}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Career Recommendations */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-[#2570A7]" />
                <CardTitle>Recomendações de Carreira</CardTitle>
              </div>
              <CardDescription>
                Áreas profissionais adequadas ao seu perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {profileInfo.careerRecommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-[#2570A7] mt-1">✓</span>
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => window.print()}
            >
              Imprimir Resultado
            </Button>
            <Button
              className="bg-[#2570A7] hover:bg-[#1B5580]"
              onClick={() => setLocation("/")}
            >
              Voltar ao Início
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-12">
        <div className="container text-center text-gray-600">
          <p>© 2026 Aponto Pesquisa. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
