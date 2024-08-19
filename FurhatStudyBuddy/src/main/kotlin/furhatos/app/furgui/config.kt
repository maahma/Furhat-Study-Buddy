package furhatos.app.furgui

import furhatos.event.Event
import furhatos.skills.RemoteGUI

val PORT = 3000 // GUI Port
val SPEECH_DONE = "SpeechDone"

// Event used to pass data to GUI
//class DataDelivery(
//        val userName : String
//) : Event()

class QuizData(
    val questions: List<QuestionData>
) : Event()

data class QuestionData(
    val questionText: String,
    val answer: String
)


