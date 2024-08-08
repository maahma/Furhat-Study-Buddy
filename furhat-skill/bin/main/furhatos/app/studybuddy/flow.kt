package furhatos.app.studybuddy

import furhatos.event.senses.SenseSkillGUIConnected
import furhatos.flow.kotlin.*
import furhatos.records.Record
import furhatos.skills.HostedGUI

const val GREETING_USER: String = "GreetingUser"

val GUI = HostedGUI("FurhatStudyBuddy", "../front-end", PORT)

val NoGUI: State = state(null) {
    onEvent<SenseSkillGUIConnected> {
        goto(GUIConnected)
    }
}

val GUIConnected: State = state(NoGUI) {
    onEvent(GREETING_USER) {data ->
        // Handle the event data
        val userName = data["data"] as String
        // Respond to the user or perform actions based on the data
        furhat.say("Hello, $userName!")
    }
}







//val inputFieldData = mutableMapOf<String, (String) -> String>(
//    "Name" to { name -> "Nice to meet you $name" },
//    // Other input fields
//)
//
//
///
//val GUIConnected: State = state(NoGUI) {
//
//    onEvent(USER_LOGIN_EVENT) { event ->
//        val userName = event.get("userName") as String
//        furhat.say("Hi $userName!")
//    }
//}
