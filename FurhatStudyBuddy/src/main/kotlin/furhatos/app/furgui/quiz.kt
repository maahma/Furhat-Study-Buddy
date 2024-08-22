package furhatos.app.furgui

import furhatos.flow.kotlin.*
import furhatos.gestures.Gestures
import furhatos.records.User
import furhatos.util.*

// Variable to keep track of the current question index
var currentQuestionIndex = 0
val incorrectQuestions = mutableListOf<QuestionData>()

val QuizState = state {
    onEntry {
        currentQuestionIndex = 0 // Reset the question index when starting the quiz
        reentry() // Start asking questions
    }

    onReentry {
        if (currentQuestionIndex < quizQuestions.size) {
            // Ask the current question
            val question = quizQuestions[currentQuestionIndex]
            furhat.ask(question.questionText)
        } else {
            // All questions have been asked
            if (incorrectQuestions.isNotEmpty()) {
                furhat.say("Let's go over the questions you missed.")
                quizQuestions = incorrectQuestions
                incorrectQuestions.clear()
                currentQuestionIndex = 0
                reentry() // Restart the quiz with incorrect questions
            } else {
                furhat.say("Great job! You've completed the quiz.")
                send(SPEECH_DONE) // Indicate the end of the quiz
            }
        }
    }

    onResponse {
        val userAnswer = it.text
        val correctAnswer = quizQuestions[currentQuestionIndex].answerText.trim()

        // Check for an exact match first
        if (userAnswer.equals(correctAnswer, ignoreCase = true)) {
            furhat.say("That's correct!")
        } else {
            furhat.say("User's answer is $userAnswer and correct answer is $correctAnswer")
            furhat.say("Comparing user answer and correct answer using OpenAI")
            // Create an instance of OpenAIQuizAssistant to call the method
            val quizAssistant = OpenAIQuizAssistant()

            // Use OpenAI to check if the answer is close to the correct answer
            val isClose = quizAssistant.isAnswerClose(userAnswer, correctAnswer)
            furhat.say("OpenAI returns $isClose")


            if (isClose) {
                furhat.say("That's close enough!")
            } else {
                furhat.say("Sorry, the correct answer is $correctAnswer.")
                incorrectQuestions.add(quizQuestions[currentQuestionIndex])
            }
        }

        currentQuestionIndex++
        reentry() // Move to the next question
    }
}