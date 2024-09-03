package furhatos.app.furgui

import furhatos.flow.kotlin.*
import furhatos.app.furgui.flow.*
import furhatos.app.furgui.gestures.LookingAway
import furhatos.app.furgui.gestures.SlightNod
import furhatos.records.User
import furhatos.util.Language
import furhatos.gestures.Gestures

// Variable to keep track of the current question index
var currentQuestionIndex = 0
val incorrectQuestions = mutableListOf<QuestionData>()
val skippedQuestions = mutableListOf<QuestionData>()
var inReviewSession = false

val QuizState: State  = state(parent = Parent) {
    onEntry{
        currentQuestionIndex = 0 // Reset the question index when starting the quiz
        furhat.say("I will quiz you on 20 questions. You can say 'skip' to skip a question and if you don't know the answer, you can say 'I don't know'. At the end, I will quiz you again on questions you got incorrect or skipped. You can say 'stop' anytime to stop the quiz.")
        reentry() // Start asking questions
    }

    onReentry {
        if (currentQuestionIndex < quizQuestions.size) {
            // Ask the current question
            val question = quizQuestions[currentQuestionIndex]
            furhat.ask(question.questionText, endSil = 2000, maxSpeech = 30000)
        } else {
            // All questions have been asked
            if (skippedQuestions.isNotEmpty() || incorrectQuestions.isNotEmpty()) {
                furhat.ask("You've completed the quiz. Would you like to go over the questions you skipped or got wrong?")
            } else {
                furhat.say("Great job! You've completed the quiz.")
                send(SPEECH_DONE) // Indicate the end of the quiz
            }
        }
    }

    // onInterimResponse handles interim speech results
    onInterimResponse(endSil = 500) {
        // Provide real-time feedback while the user is still speaking
        furhat.gesture(SlightNod)
    }

    onResponse<Yes> {
        // Combine skipped and incorrect questions to form the new quizQuestions list
        quizQuestions = skippedQuestions + incorrectQuestions
        skippedQuestions.clear()
        incorrectQuestions.clear()
        currentQuestionIndex = 0
        furhat.say("Let's go over the questions you missed.")
        reentry() // This re-enters QuizState and starts over
    }

    onResponse<No> {
        furhat.say("Okay, we won't review the skipped or incorrect questions. Good job on completing the quiz!")
        send(SPEECH_DONE) // Indicate the end of the quiz
    }

    onResponse<RequestRepeatQuestion> {
        furhat.ask(quizQuestions[currentQuestionIndex].questionText) // Repeat the question
    }

    onResponse<RequestRules> {
        furhat.say("You can say 'skip' to skip a question, 'I don't know' if you're unsure of the answer, and 'stop' to end the quiz at any time.")
        reentry()
    }

    onResponse<DontKnow> {
        furhat.say("No problem. We'll come back to this question later.")
        skippedQuestions.add(quizQuestions[currentQuestionIndex])
        currentQuestionIndex++
        reentry()
    }

    onResponse<SkipQuestion> {
        furhat.say("Alright, let's skip this one.")
        skippedQuestions.add(quizQuestions[currentQuestionIndex])
        currentQuestionIndex++
        reentry()
    }

    onResponse<StopQuiz> {
        furhat.say("Okay, stopping the quiz. We can continue later if you want.")
        send(SPEECH_DONE) // Indicate the end of the quiz
    }

    onResponse {
        val userAnswer = it.text
        val correctAnswer = quizQuestions[currentQuestionIndex].answerText.trim()

        // Check for an exact match first
        if (userAnswer.equals(correctAnswer, ignoreCase = true)) {
            furhat.gesture(Gestures.Smile)
            furhat.say("That's correct!")
        } else {
            val checking = utterance {
                +"Hmm,"
                + LookingAway
                +"Let me check your answer"
                + delay(4000)
            }

            furhat.say(checking)

            // Create an instance of OpenAIQuizAssistant to call the method
            val quizAssistant = OpenAIQuizAssistant()

            // Use OpenAI to check if the answer is close to the correct answer
            val isClose = quizAssistant.isAnswerClose(userAnswer, correctAnswer)

            if (isClose) {
                furhat.gesture(Gestures.Smile)
                furhat.say("It's close enough!")
            } else {
                furhat.gesture(Gestures.BrowFrown)
                furhat.say("Sorry, you answered $userAnswer, but the correct answer is $correctAnswer.")
                incorrectQuestions.add(quizQuestions[currentQuestionIndex])
            }
        }

        currentQuestionIndex++
        reentry() // Move to the next question
    }
}

