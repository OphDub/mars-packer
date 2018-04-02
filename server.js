const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Mars Packer';

app.post('/api/v1/items', (request, response) => {

});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});