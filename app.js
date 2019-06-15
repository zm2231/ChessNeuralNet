const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 2000));

app.use(express.static('public'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
