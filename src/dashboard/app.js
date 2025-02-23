class DashboardApp {
  constructor() {
    this.updateInterval = 5000; // 5 seconds
    this.initialize();
  }

  async initialize() {
    await this.updateDashboard();
    setInterval(() => this.updateDashboard(), this.updateInterval);
  }

  async updateDashboard() {
    try {
      const response = await fetch('/data');
      const data = await response.json();
      
      this.updateMetrics(data);
      this.updateDetectionsList(data.recentDetections);
    } catch (error) {
      console.error('Failed to update dashboard:', error);
    }
  }

  updateMetrics(data) {
    document.getElementById('totalRequests').textContent = data.totalRequests;
    document.getElementById('detectedBots').textContent = data.detectedBots;
  }

  updateDetectionsList(detections) {
    const list = document.getElementById('detectionsList');
    list.innerHTML = detections
      .map(detection => `
        <div class="detection-item">
          <div>Type: ${detection.type}</div>
          <div>Timestamp: ${new Date(detection.timestamp).toLocaleString()}</div>
        </div>
      `)
      .join('');
  }
}

// Initialize dashboard
window.dashboard = new DashboardApp(); 