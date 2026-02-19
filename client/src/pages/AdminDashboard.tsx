import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Users, TrendingUp, Calendar, Eye } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const { data: candidates, isLoading: loadingCandidates } = trpc.recruitment.getAllCandidates.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: stats, isLoading: loadingStats } = trpc.recruitment.getStats.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2570A7]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Você precisa estar autenticado para acessar o dashboard administrativo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full bg-[#2570A7] hover:bg-[#1B5580]"
              onClick={() => window.location.href = getLoginUrl()}
            >
              Fazer Login
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setLocation("/")}
            >
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/aponto-logo.png" 
                alt="Aponto Pesquisa" 
                className="h-12 object-contain"
              />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
            </div>
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
            >
              Voltar ao Início
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Candidatos</CardTitle>
              <Users className="h-4 w-4 text-[#2570A7]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.total || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Perfil Mais Comum</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#2570A7]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingStats ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  getMostCommonProfile(stats?.byProfile)
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Última Submissão</CardTitle>
              <Calendar className="h-4 w-4 text-[#2570A7]" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {loadingCandidates ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : candidates && candidates.length > 0 ? (
                  formatDate(candidates[0].createdAt)
                ) : (
                  "Nenhuma submissão"
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Distribution */}
        {stats && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Distribuição por Perfil</CardTitle>
              <CardDescription>Quantidade de candidatos em cada perfil comportamental</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.byProfile).map(([profile, count]) => (
                  <div key={profile} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{profile}</span>
                      <span className="text-sm text-gray-600">
                        {count} candidato{count !== 1 ? "s" : ""} ({((count / stats.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-[#2570A7] h-3 rounded-full"
                        style={{ width: `${(count / Math.max(...Object.values(stats.byProfile))) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Candidates List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Candidatos</CardTitle>
            <CardDescription>Todos os candidatos que completaram o questionário</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCandidates ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#2570A7]" />
              </div>
            ) : candidates && candidates.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Nome</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Perfil</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Data</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((candidate) => (
                      <tr key={candidate.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{candidate.fullName}</td>
                        <td className="py-3 px-4">{candidate.email}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#2570A7] text-white">
                            {candidate.profileType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(candidate.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setLocation(`/resultado/${candidate.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhum candidato cadastrado ainda
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getMostCommonProfile(byProfile?: Record<string, number>): string {
  if (!byProfile) return "N/A";
  
  const entries = Object.entries(byProfile);
  if (entries.length === 0) return "N/A";
  
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  return sorted[0][0];
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
