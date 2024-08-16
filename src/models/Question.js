const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  question: {
    type: String,
    // required: true,
  },
  options: {
    type: [String],
    // required: true,
    // validate: {
    //   validator: function (arr) {
    //     return arr.length === 4; // Ensure there are exactly 4 options
    //   },
    //   message: "There must be exactly 4 options.",
    // },
  },
  correctOption: {
    type: Number,
    // required: true,
    min: 0,
    max: 3, 
  },
  points: {
    default:0,
    type: Number,
    // required: true,
  },
});



const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
