(function(global) {
  class GuardianTracker {
    constructor(projectKey) {
      this.projectKey = projectKey;
      this.sessionId = this.generateSessionId();
      this.eventBuffer = [];
      this.init();
    }

    generateSessionId() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    }

    init() {
      this.setupEventListeners();
      this.startPeriodicTracking();
      this.track('pageview');
    }

    setupEventListeners() {
      document.addEventListener('mousemove', this.throttle((e) => {
        this.addEvent('mousemove', {
          x: e.clientX,
          y: e.clientY
        });
      }, 50));

      document.addEventListener('click', (e) => {
        this.addEvent('click', {
          x: e.clientX,
          y: e.clientY,
          target: e.target.tagName
        });
      });

      document.addEventListener('scroll', this.throttle(() => {
        this.addEvent('scroll', {
          position: window.scrollY
        });
      }, 100));
    }

    throttle(func, limit) {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }

    addEvent(type, data) {
      this.eventBuffer.push({
        type,
        data,
        timestamp: Date.now()
      });

      if (this.eventBuffer.length >= 10) {
        this.flushEvents();
      }
    }

    async flushEvents() {
      if (this.eventBuffer.length === 0) return;

      const events = [...this.eventBuffer];
      this.eventBuffer = [];

      try {
        await fetch('/guardian/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            projectKey: this.projectKey,
            sessionId: this.sessionId,
            events,
            userAgent: navigator.userAgent,
            url: window.location.href
          })
        });
      } catch (error) {
        console.error('Guardian tracking error:', error);
        this.eventBuffer = [...events, ...this.eventBuffer];
      }
    }

    startPeriodicTracking() {
      setInterval(() => this.flushEvents(), 5000);
    }

    track(eventType, customData = {}) {
      this.addEvent(eventType, customData);
    }
  }

  // Make tracker available globally
  if (typeof global !== 'undefined') {
    global.GuardianTracker = GuardianTracker;
  }

  // Auto-initialize if project key is present
  if (typeof document !== 'undefined') {
    const script = document.currentScript;
    if (script) {
      const projectKey = script.getAttribute('data-project-key');
      if (projectKey) {
        global.guardian = new GuardianTracker(projectKey);
      }
    }
  }
})(typeof window !== 'undefined' ? window : global); 