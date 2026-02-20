import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { disqualificationMessages, type DisqualificationReason } from "@/lib/eligibilityCheck";

export default function Disqualified() {
  const [, setLocation] = useLocation();
  
  // Pegar o motivo da desqualificação da URL
  const params = new URLSearchParams(window.location.search);
  const reason = params.get("reason") as DisqualificationReason | null;
  
  const reasonData = reason && disqualificationMessages[reason]
    ? disqualificationMessages[reason]
    : {
        title: "Não Elegível",
        message: "Infelizmente, você não atende aos critérios necessários para participar desta pesquisa."
      };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl">
            Infelizmente você não se qualifica
          </CardTitle>
          <CardDescription className="text-base">
            {reasonData.title}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-center text-gray-600">
            {reasonData.message}
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 text-center">
              Obrigado pelo seu interesse em participar da nossa pesquisa!
            </p>
          </div>
          
          <Button
            onClick={() => setLocation("/")}
            className="w-full"
            size="lg"
          >
            <Home className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
