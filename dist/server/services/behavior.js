"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeBehavior = analyzeBehavior;
function analyzeBehavior(events) {
    const analysis = {
        isBot: false,
        confidence: 0,
        factors: []
    };
    // Analyze mouse movements
    const mouseEvents = events.filter(e => e.type === 'mousemove');
    if (mouseEvents.length > 0) {
        const isLinear = checkLinearMovement(mouseEvents);
        if (isLinear) {
            analysis.factors.push('linear_movement');
            analysis.confidence += 0.4;
        }
        const hasUniformSpeed = checkUniformSpeed(mouseEvents);
        if (hasUniformSpeed) {
            analysis.factors.push('uniform_speed');
            analysis.confidence += 0.4;
        }
    }
    // Analyze click patterns
    const clickEvents = events.filter(e => e.type === 'click');
    if (clickEvents.length > 0) {
        const isRegular = checkRegularClicks(clickEvents);
        if (isRegular) {
            analysis.factors.push('regular_clicks');
            analysis.confidence += 0.3;
        }
    }
    // Final verdict
    analysis.isBot = analysis.confidence >= 0.7;
    return analysis;
}
function checkLinearMovement(events) {
    if (events.length < 3)
        return false;
    let linearCount = 0;
    for (let i = 2; i < events.length; i++) {
        const p1 = events[i - 2].data;
        const p2 = events[i - 1].data;
        const p3 = events[i].data;
        if (p1.x !== undefined && p1.y !== undefined &&
            p2.x !== undefined && p2.y !== undefined &&
            p3.x !== undefined && p3.y !== undefined) {
            if (isCollinear({ x: p1.x, y: p1.y }, { x: p2.x, y: p2.y }, { x: p3.x, y: p3.y })) {
                linearCount++;
            }
        }
    }
    return linearCount / (events.length - 2) > 0.8;
}
function checkUniformSpeed(events) {
    if (events.length < 2)
        return false;
    const speeds = events.map((e, i) => {
        if (i === 0)
            return 0;
        const prev = events[i - 1];
        const dt = e.timestamp - prev.timestamp;
        if (dt === 0)
            return 0;
        if (e.data.x !== undefined && e.data.y !== undefined &&
            prev.data.x !== undefined && prev.data.y !== undefined) {
            const dx = e.data.x - prev.data.x;
            const dy = e.data.y - prev.data.y;
            return Math.sqrt(dx * dx + dy * dy) / dt;
        }
        return 0;
    }).filter(s => s > 0);
    if (speeds.length < 2)
        return false;
    const avgSpeed = speeds.reduce((a, b) => a + b) / speeds.length;
    const variance = speeds.reduce((a, b) => a + Math.pow(b - avgSpeed, 2), 0) / speeds.length;
    return variance < 0.1 * avgSpeed;
}
function checkRegularClicks(events) {
    if (events.length < 2)
        return false;
    const intervals = [];
    for (let i = 1; i < events.length; i++) {
        intervals.push(events[i].timestamp - events[i - 1].timestamp);
    }
    const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
    const variance = intervals.reduce((a, b) => a + Math.pow(b - avgInterval, 2), 0) / intervals.length;
    return variance < 1000;
}
function isCollinear(p1, p2, p3) {
    const area = Math.abs((p2.x - p1.x) * (p3.y - p1.y) -
        (p3.x - p1.x) * (p2.y - p1.y));
    return area < 1;
}
