// src/components/GuardianDashboard.tsx
import React, { useState, useEffect } from 'react';
import { guardianStorage } from '../services/guardianStorage';
import { DetectionResult } from '../types';

export const GuardianDashboard: React.FC = () => {
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    bots: 0,
    legitimate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/guardian/detections');
        const results: DetectionResult[] = await response.json();
        setDetections(results);
        
        const stats = {
          total: results.length,
          bots: results.filter((r: DetectionResult) => r.isBot).length,
          legitimate: results.filter((r: DetectionResult) => !r.isBot).length
        };
        
        setStats(stats);
      } catch (error) {
        console.error('Error fetching detections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="guardian-dashboard">
      <div className="stats-summary">
        <div className="stat-card">
          <h3>Total Visits</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Bot Visits</h3>
          <p>{stats.bots}</p>
        </div>
        <div className="stat-card">
          <h3>Human Visits</h3>
          <p>{stats.legitimate}</p>
        </div>
      </div>

      <table className="detections-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Type</th>
            <th>Path</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          {detections.map((detection: DetectionResult) => (
            <tr key={`${detection.timestamp}-${detection.ip}`}>
              <td>{detection.timestamp?.toLocaleString() || 'N/A'}</td>
              <td>{detection.isBot ? '🤖 Bot' : '👤 Human'}</td>
              <td>{detection.path}</td>
              <td>{(detection.confidence * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GuardianDashboard;