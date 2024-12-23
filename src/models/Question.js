const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  question: {
    type: String,
  },
  options: {
    type: [String],
  },
  correctOption: {
    type: Number,
    min: 0,
    max: 3, 
  },
  points: {
    default:0,
    type: Number,
  },
});



const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
