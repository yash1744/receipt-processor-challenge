import Joi  from "joi";
import moment from 'moment';

const receiptSchema = Joi.object({
  retailer: Joi.string().min(1).required(), // Must be alphanumeric and non-empty
  purchaseDate: Joi.string().custom((value, helper) => {
    var date = moment(value);
    if (!date.isValid()) {
      return helper.message("Date is Invalid");
    }
    return true;
  }).required(), // date format
  purchaseTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(), // Time in 24-hour HH:mm format
  items: Joi.array()
    .items(
      Joi.object({
        shortDescription: Joi.string().trim().min(1).required(), // Non-empty string after trimming
        price: Joi.string().pattern(/^\d+(\.\d{1,2})?$/).required(), // Numeric string with optional two decimal places
      })
    )
    .min(1) // At least one item required
    .required(),
  total: Joi.string()
    .pattern(/^\d+(\.\d{1,2})?$/) // Numeric string with optional two decimal places
    .required(),
});




export default receiptSchema;