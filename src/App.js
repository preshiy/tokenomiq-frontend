import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

const CHAINS = ["ethereum", "solana", "bsc", "base", "arbitrum"];

export default function App() {
  const [tokenQuery, setTokenQuery] = useState("");
  const [whitepaperText, setWhitepaperText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = async () => {
    if (!tokenQuery.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("https://tokenomiq-backend.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenQuery, whitepaperText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">TokenomIQ</span>
        </div>
        <p className="tagline">
          The only agent that catches when teams lie in their whitepapers
        </p>
      </header>

      <main className="main">
        <div className="card input-card">
          <div className="input-group">
            <label>Token Name or Symbol</label>
            <input
              type="text"
              placeholder="e.g. solana, uniswap, BTC, 0x..."
              value={tokenQuery}
              onChange={(e) => setTokenQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && analyze()}
            />
          </div>

          <div className="input-group">
            <label>
              Whitepaper / Tokenomics Text{" "}
              <span className="optional">(optional — enables cross-reference)</span>
            </label>
            <textarea
              placeholder="Paste the project's whitepaper or tokenomics section here..."
              value={whitepaperText}
              onChange={(e) => setWhitepaperText(e.target.value)}
              rows={5}
            />
          </div>

          <button
            className={`analyze-btn ${loading ? "loading" : ""}`}
            onClick={analyze}
            disabled={loading || !tokenQuery.trim()}
          >
            {loading ? (
              <><span className="spinner" /> Analyzing...</>
            ) : (
              <>⚡ Analyze Tokenomics</>
            )}
          </button>
        </div>

        <div className="chains">
          {CHAINS.map((c) => (
            <span key={c} className="chain-badge">{c}</span>
          ))}
        </div>

        {error && (
          <div className="card error-card">
            <span>❌</span> {error}
          </div>
        )}

        {result && (
          <div className="card result-card">
            <div className="result-header">
              <div>
                <h2 className="token-name">{result.token}</h2>
                <span className="token-symbol">{result.symbol}</span>
              </div>
              <span className="powered">Powered by TokenomIQ</span>
            </div>
            <div className="report">
              <ReactMarkdown>{result.report}</ReactMarkdown>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>
          Built on{" "}
          <a href="https://swarms.world/agent/c518135e-f6f0-45cd-85ee-111ed88b6b68" target="_blank" rel="noreferrer">
            Swarms Marketplace
          </a>{" "}
          · Data from CoinGecko & DeFiLlama · Not financial advice
        </p>
      </footer>
    </div>
  );
}
