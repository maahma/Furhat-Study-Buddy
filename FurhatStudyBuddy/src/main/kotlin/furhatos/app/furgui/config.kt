package furhatos.app.furgui

import furhatos.event.Event
import furhatos.skills.RemoteGUI
import furhatos.records.Record

val PORT = 3000 // GUI Port
val SPEECH_DONE = "SpeechDone"

// LIST OF QUESTIONS OBTAINED FROM FRONT-END
class QuizData(
    val questions: List<QuestionData>
) : Event()

data class QuestionData(
    val questionText: String,
    val answerText: String
) : Record()

var quizQuestions: List<QuestionData> = listOf()


