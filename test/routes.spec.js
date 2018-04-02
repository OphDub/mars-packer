const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('API endpoints', () => {
  beforeEach((done) => {
    database.migrate.rollback()
    .then(() => {
      database.migrate.latest()
      .then(() => {
        return database.seed.run()
        .then(() => {
          done();
        });
      });
    });
  });

  afterEach((done) => {
    database.migrate.rollback()
    .then(() => {
      done();
    });
  });

  describe('GET /api/v1/items', () => {
    it('should return all items', () => {
      return chai.request(server)
      .get('/api/v1/items')
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response).to.be.json;
        expect(response.body).to.be.a('array');
        expect(response.body.length).to.equal(2);
        expect(response.body[0]).to.have.property('id');
        expect(response.body[0].id).to.equal(1);
        expect(response.body[0]).to.have.property('name');
        expect(response.body[0].name).to.equal('My Macbook');
        expect(response.body[0]).to.have.property('status');
        expect(response.body[0].status).to.equal('packed');
        expect(response.body[1]).to.have.property('id');
        expect(response.body[1].id).to.equal(2);
        expect(response.body[1]).to.have.property('name');
        expect(response.body[1].name).to.equal('Coffee');
        expect(response.body[1]).to.have.property('status');
        expect(response.body[1].status).to.equal('not packed');
      })
      .catch(error => {
        throw error
      });
    });
  });

  describe('POST /api/v1/items', () => {
    it('should post an item when given the correct data', () => {
      const newItem = {
        name: 'water bottle',
        status: 'not packed'
      };

      return chai.request(server)
      .post('/api/v1/items')
      .send({item: newItem})
      .then(response => {
        expect(response.status).to.equal(201);
        expect(response).to.be.json;
        expect(response.body).to.be.a('object');
        expect(response.body).to.have.property('id');
        expect(response.body.id).to.equal(3);
        expect(response.body).to.have.property('name');
        expect(response.body.name).to.equal('water bottle');
        expect(response.body).to.have.property('status');
        expect(response.body.status).to.equal('not packed');
      });
    });

    it('should return a 404 when given incomplete data', () => {
      const incompleteItem = {
        name: 'water bottle',
      };

      return chai.request(server)
      .post('/api/v1/items')
      .send({item: incompleteItem})
      .then(response => {
        expect(response.status).to.equal(404);
        expect(response.error).to.equal(
          `Expected format: { name: <string>, status: <string> }. You are missing a "status" property.`
        );
      })
      .catch(error => {
        throw error;
      });
    });
  });

  describe('PATCH /api/v1/items/:id', () => {
    it('should change an item when given the correct id', () => {
      const itemId = 1;

      return chai.request(server)
      .patch(`/api/v1/items/${itemId}`)
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.equal('Item updated.');
      })
      .catch(error => {
        throw error;
      });
    });

    it('should return a 404 when given an incorrect item id', () => {
      const invalidItemId = 25;

      return chai.request(server)
      .patch(`/api/v1/items/${invalidItemId}`)
      .then(response => {
        expect(response.status).to.equal(404);
        expect(response.error).to.equal(
          `Unable to find item with id - ${invalidItemId}.`
        );
      })
      .catch(error => {
        throw error;
      });
    });
  });

  describe('DELETE /api/v1/items/:id', () => {
    it.skip('should delete an item when given the correct id', () => {
      const itemId = 2;

      return chai.request(server)
      .delete(`/api/v1/items/${itemId}`)
      .then(response => {

      })
      .catch(error => {
        throw error;
      });
    });

    it.skip('should return a 404 when given an incorrect item id', () => {
      const invalidItemId = 25;

      return chai.request(server)
      .delete(`/api/v1/items/${invalidItemId}`)
      .then(response => {

      })
      .catch(error => {
        throw error;
      });
    });
  });
});