import { expect } from "chai";
import {
  calculateRetailerPoints,
  calculateRoundDollarPoints,
  calculateMultipleOfQuarterPoints,
  calculateItemPoints,
  calculateItemDescriptionPoints,
  calculatePurchaseDatePoints,
  calculatePurchaseTimePoints,
  validateTotal,
} from "../src/utils.js";

describe("calculateRetailerPoints", () => {
  it("should return the number of alphanumeric characters in the retailer name", () => {
    expect(calculateRetailerPoints("RetailerName123")).to.equal(15);
    expect(calculateRetailerPoints(" Target ")).to.equal(6);
    expect(calculateRetailerPoints(" Albertsons & co")).to.equal(12);
    expect(calculateRetailerPoints("Retailer123!")).to.equal(11);
  });

  it("should handle empty retailer names", () => {
    expect(calculateRetailerPoints("")).to.equal(0);
  });
});

describe("calculateRoundDollarPoints", () => {
  it("should return 50 points for round dollar amounts", () => {
    expect(calculateRoundDollarPoints("50.00")).to.equal(50);
    expect(calculateRoundDollarPoints("100")).to.equal(50);
  });

  it("should return 0 points for non-round dollar amounts", () => {
    expect(calculateRoundDollarPoints("50.25")).to.equal(0);
    expect(calculateRoundDollarPoints("0.99")).to.equal(0);
  });
});

describe("calculateMultipleOfQuarterPoints", () => {
  it("should return 25 points for amounts that are multiples of 0.25", () => {
    expect(calculateMultipleOfQuarterPoints("50.00")).to.equal(25);
    expect(calculateMultipleOfQuarterPoints("75.25")).to.equal(25);
  });

  it("should return 0 points for amounts that are not multiples of 0.25", () => {
    expect(calculateMultipleOfQuarterPoints("50.20")).to.equal(0);
    expect(calculateMultipleOfQuarterPoints("99.99")).to.equal(0);
  });
});

describe("calculateItemPoints", () => {
  it("should return 5 points for every two items", () => {
    expect(calculateItemPoints([{}, {}])).to.equal(5);
    expect(calculateItemPoints([{}, {}, {}, {}])).to.equal(10);
  });

  it("should return 0 points for fewer than two items", () => {
    expect(calculateItemPoints([{}])).to.equal(0);
    expect(calculateItemPoints([])).to.equal(0);
  });
});

describe("calculateItemDescriptionPoints", () => {
  it("should calculate points based on description length being a multiple of 3", () => {
    expect(
      calculateItemDescriptionPoints([
        { shortDescription: "Des", price: "10.75" },
        { shortDescription: "ShortDesc", price: "5.99" },
      ])
    ).to.equal(5);

    expect(
      calculateItemDescriptionPoints([
        { shortDescription: "Des", price: "10.00" },
      ])
    ).to.equal(2);
  });
});

it("should return 0 points if no descriptions are multiples of 3", () => {
  expect(
    calculateItemDescriptionPoints([
      { shortDescription: "Description", price: "10.00" },
    ])
  ).to.equal(0);
});

describe("calculatePurchaseDatePoints", () => {
  it("should return 6 points for odd days", () => {
    expect(calculatePurchaseDatePoints("2024-09-13")).to.equal(6);
    expect(calculatePurchaseDatePoints("2024-09-15")).to.equal(6);
  });

  it("should return 0 points for even days", () => {
    expect(calculatePurchaseDatePoints("2024-09-12")).to.equal(0);
    expect(calculatePurchaseDatePoints("2024-09-14")).to.equal(0);
  });
});

describe("calculatePurchaseTimePoints", () => {
  it("should return 10 points for times between 2:00 PM and 4:00 PM", () => {
    expect(calculatePurchaseTimePoints("15:25")).to.equal(10);
  });

  it("should return 0 points for times outside the range", () => {
    expect(calculatePurchaseTimePoints("14:00")).to.equal(0);
    expect(calculatePurchaseTimePoints("13:59")).to.equal(0);
    expect(calculatePurchaseTimePoints("16:00")).to.equal(0);
    expect(calculatePurchaseTimePoints("16:01")).to.equal(0);
  });
});


