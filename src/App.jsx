import { useState } from 'react'

function App() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])

  const handleScan = async () => {
    const res = await fetch('https://your-worker-url.workers.dev', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: input.trim()
    })
    const data = await res.json()
    setResults(data)
  }

  const copyCSV = () => {
    const csv = results
      .filter(r => r.proxyip)
      .map(r => `${r.ip},${r.port},${r.countryCode},${r.asOrganization}`)
      .join('\n')
    navigator.clipboard.writeText(csv)
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Batch Proxy Checker</h1>
      <textarea
        rows="10"
        cols="40"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="ip:port\nip:port..."
      /><br />
      <button onClick={handleScan}>Scan</button>
      <button onClick={copyCSV}>Copy CSV</button>
      <table border="1" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>IP</th><th>Port</th><th>Country</th><th>Org</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i}>
              <td>{r.ip}</td>
              <td>{r.port}</td>
              <td>{r.countryCode} - {r.countryName}</td>
              <td>{r.asOrganization}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
