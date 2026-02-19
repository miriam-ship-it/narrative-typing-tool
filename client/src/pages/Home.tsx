import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { CheckCircle2, Users, Target, TrendingUp } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <img 
              src="/aponto-logo.png" 
              alt="Aponto Pesquisa" 
              className="h-12 object-contain"
            />
            <Button
              variant="outline"
              onClick={() => setLocation("/admin")}
            >
              Dashboard Admin
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ferramenta de Classificação de Perfil Narrativo
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Descubra seu perfil de jogador através de uma análise comportamental detalhada. 
            Responda ao questionário e receba recomendações personalizadas de carreira na indústria de jogos.
          </p>
          <Button 
            size="lg" 
            className="bg-[#2570A7] hover:bg-[#1B5580] text-white px-8 py-6 text-lg"
            onClick={() => setLocation("/formulario")}
          >
            Iniciar Questionário
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CheckCircle2 className="h-10 w-10 text-[#2570A7] mb-2" />
              <CardTitle>Análise Completa</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Questionário baseado na metodologia Netflix de segmentação narrativa
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-[#2570A7] mb-2" />
              <CardTitle>5 Perfis Distintos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Empath, Pioneer, Mechanist, Collaborator e Nester
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Target className="h-10 w-10 text-[#2570A7] mb-2" />
              <CardTitle>Resultado Detalhado</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Receba uma análise completa com características e scores
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-[#2570A7] mb-2" />
              <CardTitle>Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Sugestões de carreira adequadas ao seu perfil comportamental
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Profiles */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Conheça os Perfis</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2570A7]">🎭 Empath (Empático)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Valorizam conexão emocional com personagens e narrativas envolventes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#2570A7]">🚀 Pioneer (Pioneiro)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Exploradores que buscam inovação e liberdade em mundos abertos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#2570A7]">⚙️ Mechanist (Mecanicista)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Focados em dominar mecânicas e sistemas complexos de jogo
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#2570A7]">👥 Collaborator (Colaborador)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Encontram satisfação em experiências compartilhadas e cooperação
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#2570A7]">🏠 Nester (Aninhador)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Buscam conforto e experiências relaxantes com customização
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#2570A7] text-white py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para descobrir seu perfil?</h2>
          <p className="text-xl mb-8 opacity-90">
            O questionário leva aproximadamente 10-15 minutos para ser concluído
          </p>
          <Button 
            size="lg" 
            variant="outline"
            className="bg-white text-[#2570A7] hover:bg-gray-100 px-8 py-6 text-lg border-0"
            onClick={() => setLocation("/formulario")}
          >
            Começar Agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container text-center text-gray-600">
          <p>© 2026 Aponto Pesquisa. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
