package furhatos.app.furgui.flow

import furhatos.app.furgui.flow.Parent
import furhatos.flow.kotlin.*
import furhatos.gestures.Gestures
import furhatos.nlu.common.Greeting
import furhatos.records.Location

val Greeting: State = state(Parent) {
    onEntry {
        furhat.say("Hello there! Welcome to the Furhat Study Buddy application!")
        furhat.gesture(Gestures.Smile)
        /** leave the conversation open for user to return the greeting **/
        furhat.listen()
    }

    onResponse<Greeting> {
        furhat.say("There’s so much you can do with this application. Head over to the Home Page to discover more.")
        goto(Parent)
    }

    onNoResponse {
        furhat.say("There’s so much you can do with this application. Head over to the Home Page to discover more.")
        goto(Parent)
    }
}