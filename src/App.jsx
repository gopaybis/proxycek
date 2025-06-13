import React, { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    const lines = input.split("\n").map((line) => line.trim()).filter(Boolean);
    setLoading(true);
    const resList = [];

    for (const line of lines) {
      const [ip, port] = line.split(":");
      try {
        const res = await fetch(`https://apihealtcheck.vercel.app/api/v1?ip=${ip}&port=${port}`);
        const json = await res.json();
        resList.push(json);
        setResults([...resList]);
      } catch (e) {
        resList.push({ ip, port, error: "Failed to fetch" });
        setResults([...resList]);
      }
    }
    setLoading(false);
  };

  const handleCopy = () => {
    const text = results
      .filter(r => r.proxyip)
      .map(r => \`\${r.ip},\${r.port},\${r.countryCode},\${r.asOrganization}\`)
      .join("\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Batch Proxy Checker</h1>
      <textarea
        rows={10}
        style={{ width: "100%", marginBottom: 10 }}
        placeholder={"Masukkan proxy:\n103.167.234.131:2053\n195.246.110.155:8443"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div style={{ marginBottom: 10 }}>
        <button onClick={handleScan} disabled={loading}>
          {loading ? "Memindai..." : "Scan Proxies"}
        </button>
        <button onClick={handleCopy} style={{ marginLeft: 10 }}>
          Salin Hasil
        </button>
      </div>
      <div>
        {results.map((r, i) => (
          <div key={i} style={{ border: "1px solid #ccc", marginBottom: 10, padding: 10 }}>
            <strong>{r.ip}:{r.port}</strong> — {r.message || r.error}<br/>
            {r.proxyip && (
              <>
                Org: {r.asOrganization} — {r.countryName} {r.countryFlag}<br/>
                ASN: {r.asn} — Colo: {r.colo}<br/>
                Delay: {r.delay} — Protocol: {r.httpProtocol}<br/>
                Lat: {r.latitude}, Lon: {r.longitude}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}