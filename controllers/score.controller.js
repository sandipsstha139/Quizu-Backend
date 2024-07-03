import { startSession } from "mongoose";
import Quiz from "../models/quiz.model.js";
import Score from "../models/score.model.js";
import { User } from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";

// export const createScore = CatchAsync(async (req, res, next) => {
//   const user = await User.findById(req.body.user);

//   if (!user) {
//     return next(new AppError("No User with that ID!", 404));
//   }
//   const quiz = await Quiz.findById(req.body.quiz);

//   if (!quiz) {
//     return next(new AppError("No Quiz with that ID!", 404));
//   }

//   const score = await Score.create(req.body);

//   user.score.push(score._id);
//   await user.save();

//   res.status(200).json({
//     status: "Success",
//     message: "Score Created Successfully",
//     data: {
//       score,
//     },
//   });
// });

export const createScore = CatchAsync(async (req, res, next) => {
  const {
    user: userId,
    quiz: quizId,
    selectedOptions,
    totalScore,
    correctAnswers,
    wrongAnswers,
    notAnswered,
    timeTaken,
  } = req.body;

  try {
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("No User with that ID!", 404));
    }

    // Find quiz and populate questions
    const quiz = await Quiz.findById(quizId).populate("questions");
    if (!quiz) {
      return next(new AppError("No Quiz with that ID!", 404));
    }

    // Calculate scores based on selected options
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let notAnswered = 0;

    selectedOptions.forEach((option) => {
      const question = quiz.questions.find(
        (q) => q._id.toString() === option.questionId
      );
      if (!question) {
        notAnswered += 1; // Count as not answered if the question is not found
      } else if (option.selectedOption && option.selectedOption !== "") {
        if (question.correct_option === option.selectedOption) {
          correctAnswers += 1;
        } else {
          wrongAnswers += 1;
        }
      } else {
        notAnswered += 1; // Count as not answered if no option selected
      }
    });

    // Calculate total score
    const totalScore = correctAnswers;

    // Create score document
    const score = await Score.create({
      user: userId,
      quiz: quizId,
      score: totalScore,
      correctAnswers,
      wrongAnswers,
      notAnswered,
      timeTaken,
      selected_options: selectedOptions.map((option) => ({
        question: option.questionId,
        option: option.selectedOption,
      })),
    });

    // Update user's scores
    user.score.push(score._id);
    await user.save();

    // Send response
    res.status(200).json({
      status: "success",
      message: "Score created successfully",
      data: {
        score,
      },
    });
  } catch (error) {
    console.error("Error creating score:", error);
    next(new AppError("Server error", 500)); // Handle server error
  }
});

export const getScoreById = CatchAsync(async (req, res, next) => {
  const score = await Score.findById(req.params.id).populate("user").populate({
    path: "quiz",
    populate: "category questions",
  });

  if (!score) {
    return next(new AppError("No score found with that id!", 404));
  }
  res.status(200).json({
    status: "Success",
    message: "Score fetched Successfully",
    data: {
      score,
    },
  });
});
export const getAllScore = CatchAsync(async (req, res, next) => {
  const scores = await Score.find();
  // .populate({
  //   path: "user",
  //   select: "fullname",
  // })
  // .populate({
  //   path: "quiz",
  // });

  if (!scores) {
    return next(new AppError("No score found with that id!", 404));
  }
  res.status(200).json({
    status: "Success",
    results: scores.length,
    message: "Score fetched Successfully",
    data: {
      scores,
    },
  });
});
export const updateScore = CatchAsync(async (req, res, next) => {
  const score = await Score.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!score) {
    return next(new AppError("No score found with that id!", 404));
  }
  res.status(200).json({
    status: "Success",
    message: "Score Updated Successfully",
    data: {
      score,
    },
  });
});
export const deleteScore = CatchAsync(async (req, res, next) => {
  const score = await Score.findByIdAndDelete(req.params.id);

  if (!score) {
    return next(new AppError("No score found with that id!", 404));
  }
  res.status(200).json({
    status: "Success",
    message: "Score Deleted Successfully",
  });
});
