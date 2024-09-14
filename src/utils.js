// Function to calculate points based on retailer name
export function calculateRetailerPoints(retailer) {
  return retailer.replace(/[^a-zA-Z0-9]/g, '').length;
}

// Function to calculate points based on total amount being a round dollar amount with no cents
export function calculateRoundDollarPoints(total) {
  return parseFloat(total) % 1 === 0 ? 50 : 0;
}

// Function to calculate points if the total is a multiple of 0.25
export function calculateMultipleOfQuarterPoints(total) {
  return parseFloat(total) % 0.25 === 0 ? 25 : 0;
}

// Function to calculate points based on the number of items
export function calculateItemPoints(items) {
  return Math.floor(items.length / 2) * 5;
}

// Function to calculate points for items with a description length that is a multiple of 3
export function calculateItemDescriptionPoints(items) {
  return items.reduce((points, item) => {
    const descriptionLength = item.shortDescription.trim().length;
    if (descriptionLength % 3 === 0) {
      points += Math.ceil(parseFloat(item.price) * 0.2);
    }
    return points;
  }, 0);
}

// Function to calculate points based on the purchase date
export function calculatePurchaseDatePoints(purchaseDate) {
  const purchaseDay = new Date(purchaseDate).getDate();
  return purchaseDay % 2 !== 0 ? 6 : 0;
}

// Function to calculate points if the time of purchase is between 2:00pm and 4:00pm
export function calculatePurchaseTimePoints(purchaseTime) {
  const [hours, minutes] = purchaseTime.split(':').map(Number);
  return (hours >= 14 && minutes > 0) && (hours <= 15 && minutes <= 59) ? 10 : 0;
}

// Main function to calculate total points
export default function calculatePoints(receipt) {
  let points = 0;
  points += calculateRetailerPoints(receipt.retailer);
  points += calculateRoundDollarPoints(receipt.total);
  points += calculateMultipleOfQuarterPoints(receipt.total);
  points += calculateItemPoints(receipt.items);
  points += calculateItemDescriptionPoints(receipt.items);
  points += calculatePurchaseDatePoints(receipt.purchaseDate);
  points += calculatePurchaseTimePoints(receipt.purchaseTime);
  return points;
}

function roundToTwo(num) {
  return Math.round(num * 100) / 100;
}

export function validateTotal(receipt) {
  // Parse the total from the receipt
  const totalFromReceipt = parseFloat(receipt.total);

  // Calculate the sum of individual item prices
  const calculatedTotal = receipt.items.reduce((sum, item) => {
    return sum + parseFloat(item.price);
  }, 0);
  console.log(totalFromReceipt,calculatedTotal)
  // Compare the calculated total with the total from the receipt
  return roundToTwo(totalFromReceipt) === roundToTwo(calculatedTotal);
}