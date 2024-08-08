package furhatos.app.studybuddy

import furhatos.event.senses.SenseSkillGUIConnected
import furhatos.flow.kotlin.*
import furhatos.records.Record
import furhatos.skills.HostedGUI

const val GREETING_USER: String = "GreetingUser"
const val TESTING_EVENT: String = "GreetingEvent"

val GUI = HostedGUI("FurhatStudyBuddy", "../front-end/src", 3000)

val NoGUI: State = state(null) {
    onEvent<SenseSkillGUIConnected> {
        println("GUI is connected. Transitioning to GUIConnected state.")
        goto(GUIConnected)
    }
}

val GUIConnected: State = state(NoGUI) {
    onEntry {
        println("Entered GUIConnected state.")
    }

    onEvent(GREETING_USER) {data ->
        println("Received GREETING_USER event with data: $data")
        // Handle the event data
        val userName = data["data"] as String
        // Respond to the user or perform actions based on the data
        furhat.say("Hello, $userName!")
    }

    onEvent(TESTING_EVENT) { data ->
        println("Received GreetingEvent with data: $data")
        val message = data["param1"] as String
        furhat.say("Received message: $message")
    }
}