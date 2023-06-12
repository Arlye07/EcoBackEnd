const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  Id: {
    type: Schema.Types.ObjectId,
    auto: true
  },
  code: {
    type: String,
    unique: true
  },
  purchase_datetime: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number
  },
  purchaser: {
    type: String
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
