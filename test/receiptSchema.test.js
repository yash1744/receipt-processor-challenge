import { expect, use } from 'chai';
import receiptSchema from '../src/schema.js';

describe('Receipt Schema', () => {
  it('should validate a correct receipt', () => {
    const receipt = {
      retailer: 'M&M Corner Market',
      purchaseDate: '2022-01-01',
      purchaseTime: '13:01',
      items: [
        { shortDescription: 'Mountain Dew 12PK', price: '6.49' }
      ],
      total: '6.49'
    };

    const { error } = receiptSchema.validate(receipt);
    expect(error).to.be.undefined;
  });

  it('should return an error if retailer is missing', () => {
    const receipt = {
      retailer: '', // Missing retailer
      purchaseDate: '2022-01-01',
      purchaseTime: '13:01',
      items: [{ shortDescription: 'Mountain Dew 12PK', price: '6.49' }],
      total: '6.49'
    };

    const { error } = receiptSchema.validate(receipt);
    expect(error).to.not.be.null;
  });

  it('should return an error if purchaseDate is invalid', () => {
    const receipt = {
      retailer: 'M&M Corner Market',
      purchaseDate: '2022-01-32', // Invalid date
      purchaseTime: '13:01',
      items: [{ shortDescription: 'Mountain Dew 12PK', price: '6.49' }],
      total: '6.49'
    };

    const { error } = receiptSchema.validate(receipt);
    expect(error).to.not.be.null;
  });

  it('should return an error if purchaseTime is invalid', () => {
    const receipt = {
      retailer: 'M&M Corner Market',
      purchaseDate: '2022-01-01',
      purchaseTime: '25:00', // Invalid time
      items: [{ shortDescription: 'Mountain Dew 12PK', price: '6.49' }],
      total: '6.49'
    };

    const { error } = receiptSchema.validate(receipt);
    expect(error).to.not.be.null;
  });

  it('should return an error if items array is empty', () => {
    const receipt = {
      retailer: 'M&M Corner Market',
      purchaseDate: '2022-01-01',
      purchaseTime: '13:01',
      items: [], // Empty items array
      total: '6.49'
    };

    const { error } = receiptSchema.validate(receipt);
    expect(error).to.not.be.null;
  });

  it('should return an error if item description is empty', () => {
    const receipt = {
      retailer: 'M&M Corner Market',
      purchaseDate: '2022-01-01',
      purchaseTime: '13:01',
      items: [
        { shortDescription: '', price: '6.49' } // Empty item description
      ],
      total: '6.49'
    };

    const { error } = receiptSchema.validate(receipt);
    expect(error).to.not.be.null;
  });

  it('should return an error if item price is invalid', () => {
    const receipt = {
      retailer: 'M&M Corner Market',
      purchaseDate: '2022-01-01',
      purchaseTime: '13:01',
      items: [
        { shortDescription: 'Mountain Dew 12PK', price: 'six dollars' } // Invalid price
      ],
      total: '6.49'
    };

    const { error } = receiptSchema.validate(receipt);
    expect(error).to.not.be.null;
  });

  it('should return an error if total is invalid', () => {
    const receipt = {
      retailer: 'M&M Corner Market',
      purchaseDate: '2022-01-01',
      purchaseTime: '13:01',
      items: [{ shortDescription: 'Mountain Dew 12PK', price: '6.49' }],
      total: 'six dollars' // Invalid total
    };

    const { error } = receiptSchema.validate(receipt);
    expect(error).to.not.be.null;
  });


  it('should return an error if purchaseDate is February 30th in a non-leap year', () => {
    const receipt = {
      retailer: 'M&M Corner Market',
      purchaseDate: '2023-02-32', // Invalid date
      purchaseTime: '13:01',
      items: [{ shortDescription: 'Mountain Dew 12PK', price: '6.49' }],
      total: '6.49'
    };
  
    const { error } = receiptSchema.validate(receipt);
    expect(error).to.not.be.null;
  });

  it('should return an error if purchaseDate is February 29th in a non-leap year', () => {
    const receipt = {
      retailer: 'Valid Date Store',
      purchaseDate: '2023-02-29', // inValid non-leap year date
      purchaseTime: '13:01',
      items: [{ shortDescription: 'Mountain Dew 12PK', price: '6.49' }],
      total: '6.49'
    };
  
    const { error } = receiptSchema.validate(receipt);
    expect(error).to.not.be.undefined ;
  });

  it('should not return an error if purchaseDate is February 29th in a leap year', () => {
    const receipt = {
      retailer: 'Leap Year Store',
      purchaseDate: '2024-02-29', // Valid leap year date
      purchaseTime: '13:01',
      items: [{ shortDescription: 'Mountain Dew 12PK', price: '6.49' }],
      total: '6.49'
    };
  
    const { error } = receiptSchema.validate(receipt);
    expect(error).to.be.undefined;
  });
  
  
  
});
