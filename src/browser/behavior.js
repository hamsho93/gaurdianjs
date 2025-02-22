class GuardianTracker {
  constructor() {
    this.events = [];
    this.initializeTracking();
  }

  initializeTracking() {
    // Mouse movement tracking
    document.addEventListener('mousemove', (e) => {
      this.trackMouseMovement(e);
    });

    // Scroll tracking
    document.addEventListener('scroll', () => {
      this.trackScroll();
    });

    // Click tracking
    document.addEventListener('click', (e) => {
      this.trackClick(e);
    });
  }

  trackMouseMovement(e) {
    const acceleration = Math.sqrt(
      Math.pow(e.movementX || 0, 2) + 
      Math.pow(e.movementY || 0, 2)
    );

    this.sendData({
      type: 'mouse',
      acceleration,
      timestamp: Date.now()
    });
  }

  trackScroll() {
    const scrollSpeed = window.scrollY / (performance.now() / 1000);
    
    this.sendData({
      type: 'scroll',
      speed: scrollSpeed,
      timestamp: Date.now()
    });
  }

  trackClick(e) {
    this.sendData({
      type: 'click',
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now()
    });
  }

  async sendData(data) {
    try {
      await fetch('/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Failed to send tracking data:', error);
    }
  }
}

// Initialize tracker
window.guardianTracker = new GuardianTracker(); 