import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  CreditCard,
  TrendingUp,
  Shield,
  Cloud,
  Wheat,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Banknote,
  Loader2,
  Star
} from "lucide-react";

interface CreditFactor {
  name: string;
  score: number;
  maxScore: number;
  icon: React.ElementType;
  status: "good" | "warning" | "critical";
  description: string;
}

interface Lender {
  id: string;
  name: string;
  min_credit_score: number;
  max_loan_amount: number;
  min_loan_amount: number;
  interest_rate_min: number;
  interest_rate_max: number;
  max_term_months: number;
  requirements: string[];
}

interface InsuranceProvider {
  id: string;
  name: string;
  min_credit_score: number;
  policy_types: string[];
  premium_range_min: number;
  premium_range_max: number;
  risks_covered: string[];
}

const CreditScore = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [creditScore, setCreditScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [hasFarm, setHasFarm] = useState(false);
  const [qualifiedLenders, setQualifiedLenders] = useState<Lender[]>([]);
  const [qualifiedInsurers, setQualifiedInsurers] = useState<InsuranceProvider[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const creditFactors: CreditFactor[] = [
    {
      name: "Climate Resilience",
      score: hasFarm ? 85 : 0,
      maxScore: 100,
      icon: Cloud,
      status: hasFarm ? "good" : "critical",
      description: "Based on drought/flood preparedness and irrigation setup"
    },
    {
      name: "Predicted Yield",
      score: hasFarm ? 72 : 0,
      maxScore: 100,
      icon: Wheat,
      status: hasFarm ? "good" : "critical",
      description: "AI-estimated yield based on acreage, soil, and weather"
    },
    {
      name: "Farm Efficiency",
      score: hasFarm ? 68 : 0,
      maxScore: 100,
      icon: Zap,
      status: hasFarm ? "warning" : "critical",
      description: "Resource utilization and operational metrics"
    },
    {
      name: "Payment History",
      score: hasFarm ? 95 : 0,
      maxScore: 100,
      icon: CheckCircle,
      status: hasFarm ? "good" : "critical",
      description: "Previous loan repayments and financial behavior"
    },
    {
      name: "Insurance Coverage",
      score: hasFarm ? 40 : 0,
      maxScore: 100,
      icon: Shield,
      status: hasFarm ? "warning" : "critical",
      description: "Active parametric insurance policies"
    },
  ];

  const totalMaxScore = creditFactors.reduce((acc, f) => acc + f.maxScore, 0);
  const totalScore = creditFactors.reduce((acc, f) => acc + f.score, 0);
  const calculatedCreditScore = hasFarm ? Math.round((totalScore / totalMaxScore) * 850) : 0;

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const { data: farmData } = await supabase
          .from('farms')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
        setHasFarm(farmData && farmData.length > 0);

        const { data: lenders } = await supabase
          .from('qualified_lenders')
          .select('*')
          .order('min_credit_score', { ascending: true });
        
        const { data: insurers } = await supabase
          .from('insurance_providers')
          .select('*')
          .order('min_credit_score', { ascending: true });

        if (lenders) setQualifiedLenders(lenders as Lender[]);
        if (insurers) setQualifiedInsurers(insurers as InsuranceProvider[]);
        setLoadingData(false);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    setCreditScore(calculatedCreditScore);
  }, [calculatedCreditScore]);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = creditScore / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= creditScore) {
        setAnimatedScore(creditScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [creditScore]);

  const getScoreColor = (score: number) => {
    if (score >= 700) return "text-success";
    if (score >= 500) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 750) return "Excellent";
    if (score >= 700) return "Good";
    if (score >= 600) return "Fair";
    if (score >= 500) return "Poor";
    return "No Score";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <CheckCircle className="w-4 h-4 text-success" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-warning" />;
      default: return <Info className="w-4 h-4 text-destructive" />;
    }
  };

  const filteredLenders = qualifiedLenders.filter(l => l.min_credit_score <= creditScore);
  const filteredInsurers = qualifiedInsurers.filter(i => i.min_credit_score <= creditScore);

  if (isLoading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Dynamic Credit Score
          </h1>
          <p className="text-muted-foreground mt-1">
            Your live credit score based on climate resilience and predicted yield
          </p>
        </div>

        {/* Main Score Card */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Score Circle */}
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="12"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke={creditScore >= 700 ? "hsl(var(--success))" : creditScore >= 500 ? "hsl(var(--warning))" : "hsl(var(--destructive))"}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(animatedScore / 850) * 553} 553`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-display font-bold ${getScoreColor(creditScore)}`}>
                  {animatedScore}
                </span>
                <span className="text-sm text-muted-foreground">out of 850</span>
              </div>
            </div>

            {/* Score Details */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <span className={`text-xl font-semibold ${getScoreColor(creditScore)}`}>
                  {getScoreLabel(creditScore)}
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                {hasFarm 
                  ? "Your score is updated daily based on farm data, climate conditions, and financial activity."
                  : "Register a farm to start building your credit score."
                }
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">24hr</div>
                  <div className="text-xs text-muted-foreground">Loan Approval</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    KES {filteredLenders.length > 0 ? (Math.max(...filteredLenders.map(l => l.max_loan_amount)) / 1000000).toFixed(1) + 'M' : '0'}
                  </div>
                  <div className="text-xs text-muted-foreground">Max Eligible</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> +12
                  </div>
                  <div className="text-xs text-muted-foreground">This Month</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Factors */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Score Factors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {creditFactors.map((factor, index) => (
              <div key={index} className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      factor.status === 'good' ? 'bg-success/10' :
                      factor.status === 'warning' ? 'bg-warning/10' : 'bg-destructive/10'
                    }`}>
                      <factor.icon className={`w-5 h-5 ${
                        factor.status === 'good' ? 'text-success' :
                        factor.status === 'warning' ? 'text-warning' : 'text-destructive'
                      }`} />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{factor.name}</div>
                      <div className="text-xs text-muted-foreground">{factor.description}</div>
                    </div>
                  </div>
                  {getStatusIcon(factor.status)}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        factor.status === 'good' ? 'bg-success' :
                        factor.status === 'warning' ? 'bg-warning' : 'bg-destructive'
                      }`}
                      style={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-12 text-right">
                    {factor.score}/{factor.maxScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Tips */}
        <div className="p-6 rounded-2xl bg-card border border-border mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">How to Improve Your Score</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-muted/30">
              <Shield className="w-6 h-6 text-secondary mb-2" />
              <h3 className="font-medium text-foreground mb-1">Get Insurance</h3>
              <p className="text-sm text-muted-foreground">Activate parametric insurance to boost your score by up to 60 points.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30">
              <Cloud className="w-6 h-6 text-accent mb-2" />
              <h3 className="font-medium text-foreground mb-1">Install Kit Sensors</h3>
              <p className="text-sm text-muted-foreground">Climate Smart Agric Kit data improves prediction accuracy.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30">
              <Wheat className="w-6 h-6 text-primary mb-2" />
              <h3 className="font-medium text-foreground mb-1">Log Farm Activity</h3>
              <p className="text-sm text-muted-foreground">Regular updates on crops and yields increase your score.</p>
            </div>
          </div>
        </div>

        {/* Qualified Banks */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="w-5 h-5 text-success" />
              Qualified Banks for Loans ({filteredLenders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredLenders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLenders.map((bank) => (
                  <div key={bank.id} className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">🏦</div>
                      <h4 className="font-semibold text-foreground">{bank.name}</h4>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Up to KES {(bank.max_loan_amount/1000000).toFixed(1)}M</p>
                      <p className="text-success">{bank.interest_rate_min}% - {bank.interest_rate_max}% interest</p>
                      <p>Up to {bank.max_term_months} months term</p>
                      <p className="text-xs text-muted-foreground mt-2">Min score: {bank.min_credit_score}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Register your farm to qualify for loans
              </p>
            )}
          </CardContent>
        </Card>

        {/* Insurance Providers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Insurance Providers ({filteredInsurers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredInsurers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInsurers.map((ins) => (
                  <div key={ins.id} className="p-4 rounded-xl border bg-card hover:border-accent/50 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">🛡️</div>
                      <h4 className="font-semibold text-foreground">{ins.name}</h4>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {ins.policy_types?.slice(0, 2).map((type, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">{type}</span>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>KES {(ins.premium_range_min/1000)}K - {(ins.premium_range_max/1000)}K/year</p>
                      <p className="text-xs">Covers: {ins.risks_covered?.slice(0, 3).join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Register your farm to qualify for insurance
              </p>
            )}
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link to="/finance">
              View All Options
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          {!hasFarm && (
            <Button variant="outline" asChild>
              <Link to="/register-farm">
                Register Farm First
              </Link>
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreditScore;