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
}