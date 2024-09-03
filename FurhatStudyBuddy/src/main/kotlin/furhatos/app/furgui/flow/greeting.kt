package furhatos.app.furgui.flow

import furhatos.app.furgui.flow.Parent
import furhatos.flow.kotlin.*
import furhatos.gestures.Gestures
import furhatos.nlu.common.Greeting
import furhatos.records.Location
import furhatos.app.furgui.gestures.*
import furhatos.app.furgui.*

val Greeting: State = state(Parent) {
    onEntry {

        furhat.say("Hello there! Welcome to RORY: Your Intelligent Study Companion!")
        furhat.gesture(Gestures.Smile)

        //////// JUST TESTING DELETE LATER
//        furhat.gesture(LookingAway)
//        val checking = utterance {
//            +"Hmm,"
//            + LookingAway
//            +"Let me check your answer"
//            + delay(9000)
//        }
//
//        furhat.say(checking)
//        goto(GratitudeReflection)
//        goto(EmotionRegulation)
        //////// JUST TESTING DELETE LATER

        /** leave the conversation open for user to return the greeting **/
        furhat.listen()
    }

    onResponse<Greeting> {
        furhat.say("There’s so much you can do with this application. Check out the Home Page to discover more.")
        goto(Parent)
    }

    onNoResponse {
        furhat.say("There’s so much you can do with this application. Check out the Home Page to discover more.")
        goto(Parent)
    }
}