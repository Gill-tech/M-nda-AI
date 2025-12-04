import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Banknote, 
  Shield, 
  TrendingUp,
  Loader2,
  Star,
  Phone,
  Globe,
  CreditCard,
  AlertTriangle
} from "lucide-react";

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
  payout_triggers: string[];
}

const Finance = () => {
  const [activeTab, setActiveTab] = useState<"loans" | "insurance">("loans");
  const [creditScore, setCreditScore] = useState(720);
  const [isLoading, setIsLoading] = useState(true);
  const [lenders, setLenders] = useState<Lender[]>([]);
  const [insurers, setInsurers] = useState<InsuranceProvider[]>([]);
  
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    
    const fetchData = async () => {
      if (user) {
        // Check if user has a farm to calculate credit score
        const { data: farmData } = await supabase
          .from('farms')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
        
        if (farmData && farmData.length > 0) {
          setCreditScore(720); // Base score for registered farmers
        } else {
          setCreditScore(0);
        }

        // Fetch lenders
        const { data: lenderData } = await supabase
          .from('qualified_lenders')
          .select('*')
          .order('min_credit_score', { ascending: true });
        
        if (lenderData) setLenders(lenderData as Lender[]);

        // Fetch insurance providers
        const { data: insurerData } = await supabase
          .from('insurance_providers')
          .select('*')
          .order('min_credit_score', { ascending: true });
        
        if (insurerData) setInsurers(insurerData as InsuranceProvider[]);
        
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, authLoading, navigate]);

  const qualifiedLenders = lenders.filter(l => l.min_credit_score <= creditScore);
  const qualifiedInsurers = insurers.filter(i => i.min_credit_score <= creditScore);

  // Calculate personalized loan amounts based on credit score
  const getPersonalizedAmount = (lender: Lender) => {
    const scoreRatio = Math.min(creditScore / 850, 1);
    return Math.round(lender.min_loan_amount + (lender.max_loan_amount - lender.min_loan_amount) * scoreRatio);
  };

  // Calculate personalized interest rate
  const getPersonalizedRate = (lender: Lender) => {
    const scoreRatio = Math.min(creditScore / 850, 1);
    return lender.interest_rate_max - (lender.interest_rate_max - lender.interest_rate_min) * scoreRatio;
  };

  if (authLoading || isLoading) {
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Financial Recommendations
            </h1>
            <p className="text-muted-foreground mt-1">
              Personalized loan and insurance options based on your credit score
            </p>
          </div>
          <Button asChild>
            <Link to="/credit-score">
              <CreditCard className="w-4 h-4 mr-2" />
              View Credit Score
            </Link>
          </Button>
        </div>

        {/* Credit Score Banner */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">{creditScore}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Your Credit Score</h3>
                  <p className="text-sm text-muted-foreground">
                    {creditScore >= 700 ? "Excellent - You qualify for premium offers" :
                     creditScore >= 600 ? "Good - Multiple options available" :
                     creditScore > 0 ? "Fair - Limited options, consider improving score" :
                     "Register a farm to build your credit score"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{qualifiedLenders.length}</p>
                  <p className="text-xs text-muted-foreground">Loan Options</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{qualifiedInsurers.length}</p>
                  <p className="text-xs text-muted-foreground">Insurance Options</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("loans")}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "loans"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Banknote className="w-4 h-4 inline mr-2" />
            Loan Recommendations ({qualifiedLenders.length})
          </button>
          <button
            onClick={() => setActiveTab("insurance")}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "insurance"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Insurance Recommendations ({qualifiedInsurers.length})
          </button>
        </div>

        {/* Loan Recommendations */}
        {activeTab === "loans" && (
          <div className="space-y-6">
            {creditScore === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">Register your farm to see personalized loan recommendations</p>
                <Button asChild>
                  <Link to="/register-farm">Register Farm</Link>
                </Button>
              </Card>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <p className="text-sm text-muted-foreground">
                    Based on your credit score of <strong>{creditScore}</strong>, you qualify for these loans:
                  </p>
                </div>
                
                {qualifiedLenders.map((loan) => {
                  const personalizedAmount = getPersonalizedAmount(loan);
                  const personalizedRate = getPersonalizedRate(loan);
                  const eligibility = Math.round((creditScore / loan.min_credit_score) * 100);
                  
                  return (
                    <Card key={loan.id} className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                              🏦
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-foreground">{loan.name}</h3>
                                {eligibility >= 100 && (
                                  <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-xs font-medium flex items-center gap-1">
                                    <Star className="w-3 h-3" /> Top Match
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {loan.requirements?.slice(0, 3).map((req, i) => (
                                  <span key={i} className="px-2 py-1 rounded bg-muted text-xs text-muted-foreground">
                                    {req}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-foreground">
                                KES {(personalizedAmount / 1000000).toFixed(1)}M
                              </p>
                              <p className="text-xs text-muted-foreground">Your Amount</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-success flex items-center justify-center gap-1">
                                {personalizedRate.toFixed(1)}%
                              </p>
                              <p className="text-xs text-muted-foreground">Interest Rate</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
                                {loan.max_term_months}
                              </p>
                              <p className="text-xs text-muted-foreground">Max Months</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-primary">{Math.min(eligibility, 100)}%</p>
                              <p className="text-xs text-muted-foreground">Eligibility</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* Insurance Recommendations */}
        {activeTab === "insurance" && (
          <div className="space-y-6">
            {creditScore === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">Register your farm to see personalized insurance recommendations</p>
                <Button asChild>
                  <Link to="/register-farm">Register Farm</Link>
                </Button>
              </Card>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-accent" />
                  <p className="text-sm text-muted-foreground">
                    Based on your farm's risk profile, we recommend these insurance options:
                  </p>
                </div>
                
                {qualifiedInsurers.map((insurance) => {
                  const eligibility = Math.round((creditScore / insurance.min_credit_score) * 100);
                  
                  return (
                    <Card key={insurance.id} className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-2xl">
                              🛡️
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-foreground">{insurance.name}</h3>
                                {eligibility >= 100 && (
                                  <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-xs font-medium flex items-center gap-1">
                                    <Star className="w-3 h-3" /> Recommended
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1 mb-3">
                                {insurance.policy_types?.map((type, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium">
                                    {type}
                                  </span>
                                ))}
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-2">Risks Covered:</p>
                                <div className="flex flex-wrap gap-2">
                                  {insurance.risks_covered?.map((risk, i) => (
                                    <span key={i} className="px-2 py-1 rounded bg-warning/10 text-warning text-xs font-medium flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3" /> {risk}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              {insurance.payout_triggers && (
                                <div className="mt-3">
                                  <p className="text-xs text-muted-foreground mb-1">Automatic Triggers:</p>
                                  <p className="text-xs text-success">{insurance.payout_triggers[0]}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-6">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-foreground">
                                KES {(insurance.premium_range_min / 1000).toFixed(0)}K - {(insurance.premium_range_max / 1000).toFixed(0)}K
                              </p>
                              <p className="text-xs text-muted-foreground">Annual Premium</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-primary">{Math.min(eligibility, 100)}%</p>
                              <p className="text-xs text-muted-foreground">Eligibility</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <Card className="mt-8 bg-muted/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Disclaimer:</strong> These recommendations are based on your credit score and farm profile. 
              Actual eligibility may vary based on additional verification by the financial institutions. 
              Contact the providers directly for the most up-to-date terms and conditions.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Finance;