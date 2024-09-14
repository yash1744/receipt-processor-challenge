import { expect } from "chai";
import calculatePoints from "../src/utils.js";

/**
 * Test template for the calculatePoints function.
 * @param {Object} receipt - The receipt data to be tested.
 * @param {number} expectedPoints - The expected points.
 */
const testCalculatePoints = (receipt, expectedPoints) => {
  it(`should calculate ${expectedPoints} points for the given receipt`, () => {
    const points = calculatePoints(receipt);
    expect(points).to.equal(expectedPoints);
  });
};

describe("calculatePoints", () => {
  testCalculatePoints(
    {
      retailer: "Target",
      purchaseDate: "2022-01-01",
      purchaseTime: "13:01",
      items: [
        { shortDescription: "Mountain Dew 12PK", price: "6.49" },
        { shortDescription: "Emils Cheese Pizza", price: "12.25" },
        { shortDescription: "Knorr Creamy Chicken", price: "1.26" },
        { shortDescription: "Doritos Nacho Cheese", price: "3.35" },
        { shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ", price: "12.00" },
      ],
      total: "35.35",
    },
    28
  ); // Total Points: 28
  // Breakdown:
  //  6 points - retailer name has 6 alphanumeric characters
  //  0 points - total is not a multiple of 0.25
  //  10 points - 5 items, 2 pairs @ 5 points each
  //  3 points - "Emils Cheese Pizza" is 18 characters (a multiple of 3)
  //              item price of 12.25 * 0.2 = 2.45, rounded up is 3 points
  //  3 points - "Klarbrunn 12-PK 12 FL OZ" is 24 characters (a multiple of 3)
  //              item price of 12.00 * 0.2 = 2.4, rounded up is 3 points
  //   6 points - purchase day is odd
  // + ---------
  // = 28 points

  testCalculatePoints(
    {
      retailer: "M&M Corner Market",
      purchaseDate: "2022-03-20",
      purchaseTime: "14:33",
      items: [
        { shortDescription: "Gatorade", price: "2.25" },
        { shortDescription: "Gatorade", price: "2.25" },
        { shortDescription: "Gatorade", price: "2.25" },
        { shortDescription: "Gatorade", price: "2.25" },
      ],
      total: "9.00",
    },
    109
  ); // Total Points: 109
  // Breakdown:
  // 14 points - retailer name has 14 alphanumeric characters
  // 50 points - total is a round dollar amount
  // 25 points - total is a multiple of 0.25
  // 10 points - 4 items, 2 pairs @ 5 points each
  //
  //   0 points - purchase day is not odd
  //  10 points - purchase time is between 2-4 PM
  // + ---------
  // = 109 points

  testCalculatePoints(
    {
      retailer: "Target",
      purchaseDate: "2022-01-01",
      purchaseTime: "13:01",
      items: [
        { shortDescription: "Mountain Dew 12PK", price: "6.49" },
        { shortDescription: "Emils Cheese Pizza", price: "12.25" },
      ],
      total: "18.74",
    },
    20
  ); // Total Points: 20
  // Breakdown:
  //   6 points - retailer name has 6 alphanumeric characters
  //   0 points - total is not a round dollar amount
  //   0 points - total is not a multiple of 0.25
  //   5 points - 2 items, 1 pair @ 5 points
  //   3 points - "Emils Cheese Pizza" is 18 characters (a multiple of 3)
  //              item price of 12.25 * 0.2 = 2.45, rounded up is 3 points
  //   6 points - purchase day is odd
  //   0 points - purchase time is not between 2-4 PM
  // + ---------
  // = 20 points
});
