import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import LoadingAI from '@/components/ui/LoadingAI';
import TokenRiskCard from '@/components/ui/TokenRiskCard';
import { Button } from '@/components/ui/button';
import { Download, Share } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { downloadReport, shareReport } from '@/utils/reportUtils';
import { analyzeTokens } from '@/services/openai';
import { toast } from '@/components/ui/sonner';
import { useWallet } from '@/context/WalletContext';

interface TokenData {
  name: string;
  symbol: string;
  balance: number;
  price?: number;
}

interface TokenAnalysis {
  name: string;
  symbol: string;
  riskScore: number;
  explanation: string;
  suggestions?: string;
}

const SUPPORTED_TOKENS = [
  { name: 'Ethereum', symbol: 'ETH', coingeckoId: 'ethereum' },
  { name: 'Bitcoin', symbol: 'BTC', coingeckoId: 'bitcoin' },
  { name: 'MoveVM', symbol: 'MOVE', coingeckoId: 'move-vm' },
  { name: 'IOTA', symbol: 'MIOTA', coingeckoId: 'iota' },
  { name: 'Solana', symbol: 'SOL', coingeckoId: 'solana' },
  { name: 'Cardano', symbol: 'ADA', coingeckoId: 'cardano' },
  { name: 'Polkadot', symbol: 'DOT', coingeckoId: 'polkadot' },
  { name: 'Chainlink', symbol: 'LINK', coingeckoId: 'chainlink' },
  { name: 'Uniswap', symbol: 'UNI', coingeckoId: 'uniswap' },
  { name: 'Avalanche', symbol: 'AVAX', coingeckoId: 'avalanche-2' },
  { name: 'Polygon', symbol: 'MATIC', coingeckoId: 'matic-network' },
  { name: 'Near Protocol', symbol: 'NEAR', coingeckoId: 'near' },
  { name: 'Cosmos', symbol: 'ATOM', coingeckoId: 'cosmos' },
  { name: 'Algorand', symbol: 'ALGO', coingeckoId: 'algorand' },
  { name: 'Filecoin', symbol: 'FIL', coingeckoId: 'filecoin' },
  { name: 'Tezos', symbol: 'XTZ', coingeckoId: 'tezos' },
];

const Report = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenAnalysis, setTokenAnalysis] = useState<TokenAnalysis[]>([]);
  const { isConnected, address, balance, chainId } = useWallet();

  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected || !address) {
        toast.error('Please connect your wallet first');
        setIsLoading(false);
        return;
      }

      toast.info('AI risk analysis starting...');
      const realTokens: TokenData[] = [];

      if (parseFloat(balance) > 0) {
        realTokens.push({
          name: 'Ethereum',
          symbol: 'ETH',
          balance: parseFloat(balance),
        });
      }

      try {
        const ids = SUPPORTED_TOKENS.map((t) => t.coingeckoId).join(',');
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`
        );
        const marketData = await res.json();

        for (const token of realTokens) {
          const tokenInfo = marketData.find(
            (d: any) => d.symbol.toLowerCase() === token.symbol.toLowerCase()
          );
          if (tokenInfo) {
            token.price = tokenInfo.current_price;
          }
        }
      } catch (err) {
        console.error('Error fetching market prices:', err);
      }

      if (realTokens.length === 0) {
        toast.warning('No supported tokens with non-zero balance found. Showing empty analysis.');
        setTokenAnalysis([
          {
            name: 'N/A',
            symbol: 'N/A',
            riskScore: 1,
            explanation: 'No tokens were found in your wallet. No risk detected.',
            suggestions: 'Consider adding some assets to your wallet for future analysis.',
          },
        ]);
        setIsLoading(false);
        return;
      }

      try {
        const analysis = await analyzeTokens(realTokens);
        setTokenAnalysis(analysis);
        toast.success('AI risk analysis completed');
      } catch (err) {
        console.error('AI analysis failed:', err);
        toast.error('Failed to generate AI report');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isConnected, address, balance]);

  const overallRisk =
    tokenAnalysis.length > 0
      ? tokenAnalysis.reduce((sum, t) => sum + t.riskScore, 0) / tokenAnalysis.length
      : 0;

  const chartData = tokenAnalysis.map((token) => ({
    name: token.symbol,
    riskScore: token.riskScore,
    fill:
      token.riskScore <= 3
        ? '#68D391'
        : token.riskScore <= 6
        ? '#F6E05E'
        : '#F56565',
  }));

  const handleDownloadReport = async () => {
    try {
      await downloadReport();
    } catch (err) {
      toast.error('Failed to download report');
    }
  };

  const handleShareReport = async () => {
    try {
      await shareReport();
    } catch (err) {
      toast.error('Failed to share report');
    }
  };

  return (
    <MainLayout>
      <div className="safe-container py-8">
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 min-h-[70vh] flex items-center justify-center">
            <LoadingAI />
          </div>
        ) : (
          <div id="report-content">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">AI Risk Analysis</h1>
                  <p className="text-slate-500">Generated on {new Date().toLocaleDateString()}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleDownloadReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  {/* <Button variant="outline" onClick={handleShareReport}>
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button> */}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-50 p-5 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Average Risk Score</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold">{overallRisk.toFixed(1)}</h3>
                    <span
                      className="text-sm font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor:
                          overallRisk <= 3
                            ? '#68D391'
                            : overallRisk <= 6
                            ? '#F6E05E'
                            : '#F56565',
                        color:
                          overallRisk <= 3
                            ? '#276749'
                            : overallRisk <= 6
                            ? '#975A16'
                            : '#9B2C2C',
                      }}
                    >
                      {overallRisk <= 3
                        ? 'Low'
                        : overallRisk <= 6
                        ? 'Moderate'
                        : 'High'}{' '}
                      Risk
                    </span>
                  </div>
                  <p className="text-sm mt-3 text-slate-600">
                    Your portfolio has an{' '}
                    {overallRisk <= 3
                      ? 'low'
                      : overallRisk <= 6
                      ? 'moderate'
                      : 'high'}{' '}
                    overall risk score.
                  </p>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip
                        formatter={(value) => [`Risk Score: ${value}`, 'Risk Level']}
                      />
                      <Bar dataKey="riskScore" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-medium mb-4">Token Risk Breakdown</h2>
                {tokenAnalysis.map((token) => (
                  <TokenRiskCard
                    key={token.symbol}
                    name={token.name}
                    symbol={token.symbol}
                    riskScore={token.riskScore}
                    explanation={token.explanation}
                    suggestions={token.suggestions}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Report;
