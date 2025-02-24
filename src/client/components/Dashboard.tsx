import React, { useEffect, useState } from 'react';

interface Detection {
  timestamp: string;
  userAgent: string;
  isBot: boolean;
  confidence: number;
  botType?: string;
}

export function Dashboard() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    bots: 0,
    humans: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/detections');
        const data = await response.json();
        setDetections(data);
        
        // Calculate stats
        setStats({
          total: data.length,
          bots: data.filter((d: Detection) => d.isBot).length,
          humans: data.filter((d: Detection) => !d.isBot).length
        });
      } catch (error) {
        console.error('Error fetching detections:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <h1>Bot Guardian Dashboard</h1>
      
      <div className="stats">
        <div className="stat-card">
          <h3>Total Requests</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Bots Detected</h3>
          <p>{stats.bots}</p>
        </div>
        <div className="stat-card">
          <h3>Human Users</h3>
          <p>{stats.humans}</p>
        </div>
      </div>

      <table className="detections-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Type</th>
            <th>User Agent</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          {detections.map((detection, index) => (
            <tr key={index} className={detection.isBot ? 'bot-row' : 'human-row'}>
              <td>{new Date(detection.timestamp).toLocaleString()}</td>
              <td>{detection.isBot ? '🤖 Bot' : '👤 Human'}</td>
              <td>{detection.userAgent}</td>
              <td>{(detection.confidence * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
