import { GuardianJS } from '../dist';

const guardian = new GuardianJS({
  threshold: 0.7,
  enableBehaviorAnalysis: true,
  enableTLSFingerprinting: true
});

// Example usage with Express
import express from 'express';
const app = express();

// Add GuardianJS middleware
app.use(guardian.middleware());

// Example route
app.get('/', (req, res) => {
  res.send('Hello, protected by GuardianJS!');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000');
}); 