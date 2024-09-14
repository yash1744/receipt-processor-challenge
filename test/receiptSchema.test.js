import { expect } from "chai";
import receiptSchema from "../src/schema.js";

describe("Receipt Schema", () => {
  describe("Valid Receipts", () => {
    it("should validate a correct receipt", () => {
      const receipt = {
        retailer: "M&M Corner Market",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        items: [{ shortDescription: "Mountain Dew 12PK", price: "6.49" }],
        total: "6.49",
      };

      const { error } = receiptSchema.validate(receipt);
      expect(error).to.be.undefined;
    });
  });

  describe("Retailer Field Validation", () => {
    const invalidRetailerValues = ["", " "];

    invalidRetailerValues.forEach((retailer) => {
      it(`should return an error if retailer is '${retailer}'`, () => {
        const receipt = {
          retailer: retailer,
          purchaseDate: "2022-01-01",
          purchaseTime: "13:01",
          items: [{ shortDescription: "Mountain Dew 12PK", price: "6.49" }],
          total: "6.49",
        };

        const { error } = receiptSchema.validate(receipt);
        expect(error).to.exist;
      });
    });

    it(`should return no error if retailer is '${retailer}'`, () => {
      const receipt = {
        retailer: retailer,
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        items: [{ shortDescription: "Mountain Dew 12PK", price: "6.49" }],
        total: "6.49",
      };

      const { error } = receiptSchema.validate(receipt);
      expect(error).to.exist;
    });


  });

  describe("Purchase Date Validation", () => {
    const invalidDates = [
      "2022-01-32", // Invalid day
      "2022-1-32", // Invalid month format
      "20224-01-32", // Invalid year format
      "2023-02-30", // Invalid date
      "2023-02-29", // Non-leap year
    ];

    invalidDates.forEach((date) => {
      it(`should return an error if purchaseDate is '${date}'`, () => {
        const receipt = {
          retailer: "M&M Corner Market",
          purchaseDate: date,
          purchaseTime: "13:01",
          items: [{ shortDescription: "Mountain Dew 12PK", price: "6.49" }],
          total: "6.49",
        };

        const { error } = receiptSchema.validate(receipt);
        expect(error).to.exist;
      });
    });

    it("should not return an error if purchaseDate is February 29th in a leap year", () => {
      const receipt = {
        retailer: "Leap Year Store",
        purchaseDate: "2024-02-29",
        purchaseTime: "13:01",
        items: [{ shortDescription: "Mountain Dew 12PK", price: "6.49" }],
        total: "6.49",
      };

      const { error } = receiptSchema.validate(receipt);
      expect(error).to.be.undefined;
    });
  });

  describe("Purchase Time Validation", () => {
    const invalidTimes = ["", " ", "25:00", "13:60", "12:61", "not a time"];

    invalidTimes.forEach((time) => {
      it(`should return an error if purchaseTime is '${time}'`, () => {
        const receipt = {
          retailer: "M&M Corner Market",
          purchaseDate: "2022-01-01",
          purchaseTime: time,
          items: [{ shortDescription: "Mountain Dew 12PK", price: "6.49" }],
          total: "6.49",
        };

        const { error } = receiptSchema.validate(receipt);
        expect(error).to.exist;
      });
    });
  });

  describe("Items Field Validation", () => {
    const invalidItems = [
      {}, // Empty item
      { shortDescription: "", price: "6.49" }, // Empty item description
      { shortDescription: " ", price: "6.49" }, // single space description
      { shortDescription: "Mountain Dew 12PK", price: "" }, // Empty item price
      { shortDescription: "Mountain Dew 12PK", price: "six dollars" }, // Invalid price
      { shortDescription: "Mountain Dew 12PK", price: "" }, // Empty price
      { shortDescription: "Mountain Dew 12PK", price: "0.00" }, // Zero price
      { shortDescription: "Mountain Dew 12PK", price: "6.009" }, // More than two decimal points
      { shortDescription: "Mountain Dew 12PK", price: "-5.00" }, // Negative price
      {
        shortDescription: "Mountain Dew 12PK",
        price: "6.49",
        extraField: "extra",
      }, // Extra field
    ];

    invalidItems.forEach((item) => {
      it(`should return an error for item with ${JSON.stringify(item)}`, () => {
        const receipt = {
          retailer: "M&M Corner Market",
          purchaseDate: "2022-01-01",
          purchaseTime: "13:01",
          items: [item],
          total: "6.49",
        };

        const { error } = receiptSchema.validate(receipt);
        expect(error).to.exist;
      });
    });
  });

  describe("Total Field Validation", () => {
    const invalidTotals = [
      "six dollars", // Invalid total in words
      "abc", // Completely non-numeric
      "", // Empty total
      " ", //Empty space
      "123.456", // More than two decimal places
      "-5.00", // Negative amount
      "6.49 dollars", // Amount with extra text
    ];

    invalidTotals.forEach((total) => {
      it(`should return an error for item with ${total}`, () => {
        const receipt = {
          retailer: "M&M Corner Market",
          purchaseDate: "2022-01-01",
          purchaseTime: "13:01",
          items: [{ shortDescription: "Mountain Dew 12PK", price: "6.49" }],
          total: total,
        };

        const { error } = receiptSchema.validate(receipt);
        expect(error).to.exist;
      });
    });
  });
});
