package furhatos.app.furgui

import furhatos.event.senses.SenseSkillGUIConnected
import furhatos.flow.kotlin.*
import furhatos.records.Record
import furhatos.skills.RemoteGUI

// Our GUI declaration
val GUI = RemoteGUI("FurhatStudyBuddy", "localhost", PORT)

val GREET_USER = "GreetUser"
val DASHBOARD_LOADED = "DashboardLoaded"
val FOCUS_TIMER = "FocusTimer"
val QUIZ_ME = "QuizMe"

// Starting state, before our GUI has connected.
val NoGUI: State = state(null) {
    onEvent<SenseSkillGUIConnected> {
        goto(GUIConnected)
    }
}

val GUIConnected = state(NoGUI) {

    onEvent(GREET_USER){
        val userName = it.get("data")
        furhat.say("Hello $userName, welcome to Furhat Study Buddy application!")
        send(SPEECH_DONE)
    }

    onEvent(DASHBOARD_LOADED){
        furhat.say("This is your dashboard")
        send(SPEECH_DONE)
    }

    onEvent(FOCUS_TIMER){
        furhat.say("You can generate a schedule on this page and start a study session")
        send(SPEECH_DONE)
    }

    onEvent(QUIZ_ME){
        furhat.say("You can type your notes in the box below and let me quiz you")
        send(SPEECH_DONE)
    }
    
    // Users clicked any of our buttons
    // onEvent(CLICK_BUTTON) {
    //     // Directly respond with the value we get from the event, with a fallback
    //     furhat.say("You pressed ${it.get("data") ?: "something I'm not aware of" }")

    //     // Let the GUI know we're done speaking, to unlock buttons
    //     send(SPEECH_DONE)
    // }

    // Users saved some input
    // onEvent(VARIABLE_SET) {
    //     // Get data from event
    //     val data = it.get("data") as Record
    //     val variable = data.getString("variable")
    //     val value = data.getString("value")

    //     // Get answer depending on what variable we changed and what the new value is, and speak it out
    //     val answer = inputFieldData[variable]?.invoke(value)
    //     furhat.say(answer ?: "Something went wrong")

    //     // Let the GUI know we're done speaking, to unlock buttons
    //     send(SPEECH_DONE)
    // }
}