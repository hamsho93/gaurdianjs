import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export interface Detection {
  id?: number;
  timestamp: string;
  isBot: boolean;
  confidence: number;
  userAgent: string;
  ip: string;
}

let db: any;

export async function initDatabase() {
  db = await open({
    filename: ':memory:',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS detections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT,
      isBot INTEGER,
      confidence REAL,
      userAgent TEXT,
      ip TEXT
    )
  `);
}

export async function saveDetection(detection: Detection) {
  return db.run(`
    INSERT INTO detections (timestamp, isBot, confidence, userAgent, ip)
    VALUES (?, ?, ?, ?, ?)
  `, [
    detection.timestamp,
    detection.isBot ? 1 : 0,
    detection.confidence,
    detection.userAgent,
    detection.ip
  ]);
}

export async function getDetections() {
  return db.all('SELECT * FROM detections ORDER BY timestamp DESC');
}
