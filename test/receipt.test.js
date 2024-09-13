import { expect, use } from 'chai'
import chaiHttp from 'chai-http'
import  server from  '../src/index.js'
const chai = use(chaiHttp);

describe('Receipt Processor API', () => {
  let receiptId;

  describe('POST /receipts/process', () => {
    it('should submit a receipt for processing and return an ID', (done) => {
      chai.request.execute(server)
        .post('/receipts/process')
        .send({
          retailer: 'M&M Corner Market',
          purchaseDate: '2022-01-01',
          purchaseTime: '13:01',
          items: [
            { shortDescription: 'Mountain Dew 12PK', price: '6.49' }
          ],
          total: '6.49'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('id');
          receiptId = res.body.id; // Store the ID for later use
          done();
        });
    });

    it('should return 400 for an invalid receipt', (done) => {
      chai.request.execute(server)
        .post('/receipts/process')
        .send({
          retailer: 'M&M Corner Market',
          // Missing required fields
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error', 'Invalid receipt format');
          done();
        });
    });
  });

  describe('GET /receipts/:id/points', () => {
    it('should return the points awarded for a valid receipt ID', (done) => {
      chai.request.execute(server)
        .get(`/receipts/${receiptId}/points`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('points');
          expect(res.body.points).to.be.a('number');
          done();
        });
    });

    it('should return 404 for a non-existent receipt ID', (done) => {
      chai.request.execute(server)
        .get('/receipts/invalid-id/points')
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error', 'No receipt found for that id');
          done();
        });
    });
  });
});
