const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_EV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(express.static('public'));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Mars Packer';

app.get('/api/v1/items', (request, response) => {
  database('items').select()
    .then(items => {
      response.status(200).json(items);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/items', (request, response) => {
  const itemInfo = request.body.item;

  for (let requiredParameter of ['name', 'status']) {
    if (!itemInfo[requiredParameter]) {
      return response.status(404).send({
        error: `Expected format: { name: <string>, status: <string> }. You are missing a "${requiredParameter}" property.`
      });
    }
  }

  database('items').insert({...itemInfo}, 'id')
    .then(item => {
      const { name, status } = itemInfo;

      response.status(201).json({
        id: item[0],
        name,
        status
      });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.patch('/api/v1/items/:id', (request, response) => {
  const itemId = request.params.id;
  const { name, status } = request.body.item;
  const itemInfo = { name, status };

  database('items').where('id', itemId)
    .update({ ...itemInfo })
    .then(updated => {
      if (updated) {
        return response.status(201).json('Item updated.');
      } else {
        return response.status(404).send({
          error: `Unable to find item with id - ${itemId}.`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/items/:id', (request, response) => {
  const itemId = request.params.id;

  database('items').where('id', itemId).delete()
    .then(deleted => {
      if (deleted) {
        response.status(200).send(`Item successfully deleted.`);
      } else {
        response.status(404).send({
          error: `Unable to find item with id - ${itemId}.`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;