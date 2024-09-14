import { expect, use } from "chai";
import chaiHttp from "chai-http";
import server from "../src/index.js";
const chai = use(chaiHttp);

describe("Receipt Processor API", () => {
  let receiptId;

  describe("POST /receipts/process", () => {
    it("should submit a receipt for processing and return an ID", (done) => {
      chai.request
        .execute(server)
        .post("/receipts/process")
        .send({
          retailer: "M&M Corner Market",
          purchaseDate: "2022-01-01",
          purchaseTime: "13:01",
          items: [{ shortDescription: "Mountain Dew 12PK", price: "6.49" }],
          total: "6.49",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("id");
          receiptId = res.body.id; // Store the ID for later use
          done();
        });
    });

    it("should return a 400 error for malformed JSON", (done) => {
      chai.request
        .execute(server)
        .post("/receipts/process")
        .set("Content-Type", "application/json")
        .send(
          '{"retailer": "M&M Corner Market", "purchaseDate": "2022-01-01", "purchaseTime": "13:01", "items": [{"shortDescription": "Mountain Dew 12PK", "price": "6.49"], "total": "6.49"}'
        ) // Missing closing bracket for items
        .end((err, res) => {
          expect(res).to.have.status(400); // Expecting a 400 Bad Request error due to malformed JSON
          done();
        });
    });

    it("should return 400 for an invalid receipt", (done) => {
      chai.request
        .execute(server)
        .post("/receipts/process")
        .send({
          retailer: "M&M Corner Market",
          // Missing required fields
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("error", "Invalid receipt format");
          done();
        });
    });

    describe("Receipt Submission", () => {
      const testCases = [
        {
          description: "valid receipt with correct total",
          items: [{ shortDescription: "Mountain Dew 12PK", price: "6.49" }],
          total: "6.49",
          expectedStatus: 200,
        },
        {
          description: "valid receipt with additional items",
          items: [
            { shortDescription: "Mountain Dew 12PK", price: "6.49" },
            { shortDescription: "Snickers", price: "1.99" },
          ],
          total: "8.48",
          expectedStatus: 200,
        },
        {
          description: "valid receipt with zero total",
          items: [{ shortDescription: "Mountain Dew 12PK", price: "0.00" }], // zero prices
          total: "0.00",
          expectedStatus: 400,
        },
        {
          description: "valid receipt with incorrect total",
          items: [{ shortDescription: "Mountain Dew 12PK", price: "6.49" }],
          total: "6.50", // Incorrect total
          expectedStatus: 400,
        },
        {
          description: "valid receipt with high total",
          items: [{ shortDescription: "High Value Item", price: "99999.99" }],
          total: "99999.99",
          expectedStatus: 200,
        },
      ];

      testCases.forEach(({ description, items, total, expectedStatus }) => {
        it(`should submit a receipt for processing and return ${expectedStatus} for ${description}`, (done) => {
          chai.request
            .execute(server)
            .post("/receipts/process")
            .send({
              retailer: "M&M Corner Market",
              purchaseDate: "2022-01-01",
              purchaseTime: "13:01",
              items: items,
              total: total,
            })
            .end((err, res) => {
              if (err) return done(err);
              expect(res).to.have.status(expectedStatus);
              if (expectedStatus === 200) {
                expect(res.body).to.have.property("id");
              }
              done();
            });
        });
      });
    });
  });

  describe("GET /receipts/:id/points", () => {
    it("should return the points awarded for a valid receipt ID", (done) => {
      chai.request
        .execute(server)
        .get(`/receipts/${receiptId}/points`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("points");
          expect(res.body.points).to.be.a("number");
          done();
        });
    });

    it("should return 404 for a non-existent receipt ID", (done) => {
      chai.request
        .execute(server)
        .get("/receipts/invalid-id/points")
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property(
            "error",
            "No receipt found for that id"
          );
          done();
        });
    });
  });
});
