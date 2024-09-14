import Joi from "joi";
import moment from "moment";
import Decimal from "decimal.js";

const priceValidationSchema = (value, helper) => {
  try {
    const decimalValue = new Decimal(value);
    if (decimalValue.greaterThan(0) && decimalValue.toFixed(2) === value) {
      return true;
    }
    throw error;
  } catch (error) {
    return helper.message("invalid price");
  }
};

const timeValidationSchema = (value, helper) => {
  const time = moment(value, "HH:mm", true);
  if (!time.isValid()) {
    return helper.message("Time is Invalid");
  }
  return true;
};

const dateValidationSchema = (value, helper) => {
  var date = moment(value, "YYYY-MM-DD");
  if (!date.isValid()) {
    return helper.message("Date is Invalid");
  }
  return true;
};

const receiptSchema = Joi.object({
  retailer: Joi.string().trim().min(1).required(), // Must be non-empty
  purchaseDate: Joi.string().custom(dateValidationSchema).required(), // date format
  purchaseTime: Joi.string().custom(timeValidationSchema).required(), // Time in 24-hour HH:mm format
  items: Joi.array()
    .items(
      Joi.object({
        shortDescription: Joi.string().trim().min(1).required(), // Non-empty string after trimming
        price: Joi.string().custom(priceValidationSchema).required(), // Numeric string with optional two decimal places
      })
    )
    .min(1) // At least one item required
    .required(),
  total: Joi.string()
    .custom(priceValidationSchema) // Numeric string with optional two decimal places
    .required(),
});

export default receiptSchema;
