const { GuardianJS } = require('@guardianjs/core');
const express = require('express');

const app = express();
const guardian = new GuardianJS();

app.use(guardian.middleware());

app.get('/', (req, res) => {
  res.send('Protected by GuardianJS');
});

app.listen(3000, () => {
  console.log('Test app running on port 3000');
});
