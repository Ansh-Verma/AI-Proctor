const mongoose = require('mongoose');
const responseSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  answerIndex: { type: Number },          // For multiple-choice answers (index)
  descriptiveAnswer: { type: String },    // For descriptive answers (text)
  similarity: { type: Number },           // Semantic similarity for descriptive questions
  plagiarism: { type: Number }            // Plagiarism score for individual response
});

const examResponseSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  studentId: { type: String, required: true }, // or reference a User model if available
  responses: [responseSchema],
  plagiarismScore: { type: Number, default: 0 }, // Overall plagiarism score
  score: { type: Number, default: 0 },            // Final percentage score of the exam
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExamResponse', examResponseSchema);
