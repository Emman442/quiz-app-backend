const Question = require("../models/Question")

const fetchQuestion = async(req, res, next)=>{
    try {
        const questions = await Question.find({});
        res.status(200).json({
            status: "success",
            data: {questions}
        })
    } catch (error) {
        res.status(500).json({
            message: "Error Fetching Questions",
            error
        })
    }
}
const uploadQuestions = async(req, res, next)=>{
    try {
        const questions = await Question.insertMany(req.body);
        res.status(200).json({
            status: "success",
            data: {questions}
        })
    } catch (error) {
        res.status(500).json({
            message: "Error Uploading Questions",
            error
        })
    }
}

const createQuestion = async(req, res, next)=>{
    try {
      const question = await Question.create(req.body);
      res.status(200).json({
        status: "success",
        data: { question },
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating Questions",
        error,
      });
    }
}
module.exports ={fetchQuestion, uploadQuestions, createQuestion}