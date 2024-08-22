package furhatos.app.furgui

import furhatos.event.senses.SenseSkillGUIConnected
import furhatos.flow.kotlin.*
import furhatos.records.Record
import furhatos.skills.RemoteGUI
import furhatos.app.furgui.flow.*

// Our GUI declaration
val GUI = RemoteGUI("FurhatStudyBuddy", hostname= "localhost", PORT)

// Starting state, before our GUI has connected.
val NoGUI: State = state(null) {
    onEvent<SenseSkillGUIConnected> {
        goto(GUIConnected)
    }
}

val GUIConnected = state(NoGUI) {
    onEntry{
        furhat.say("Connected to the application")
        goto(Init)
    }

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