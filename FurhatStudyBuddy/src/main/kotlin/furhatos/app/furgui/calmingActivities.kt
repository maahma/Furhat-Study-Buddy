package furhatos.app.furgui

import furhatos.app.furgui.flow.*
import furhatos.flow.kotlin.*
import furhatos.gestures.Gestures
import furhatos.nlu.common.Greeting
import furhatos.records.Location
import furhatos.app.furgui.gestures.*
import kotlin.random.Random

val CalmingActivity: State = state(parent = Parent) {
//    val openAISerenityAssistant = openAICalmingExercises()
//
//    onEntry {
//        furhat.say("Let's do a calming activity together.")
//
//        val activity = Random.nextInt(2)
////
//        when (activity) {
//            0 -> goto(BreathingExerciseState)
//            1 -> goto(EmotionRegulation)
//            2 -> goto(GratitudeReflection)
//        }
//
//        furhat.say("I hope you feel more relaxed now.")
//    }


    onEntry {
        furhat.say("You seem a little stressed")
        furhat.ask("Would you like to do a calming activity together?")
    }

    onResponse<Yes> {
        furhat.say("Great! Let's do a calming activity together.")

        val activity = Random.nextInt(3)

        when (activity) {
            0 -> goto(BreathingExerciseState)
            1 -> goto(GratitudeReflection)
            2 -> goto(EmotionRegulation)
        }

        furhat.say("I hope you feel more relaxed now.")
    }

    onResponse<No> {
        furhat.say("That's okay.")
        furhat.gesture(Gestures.Smile)
        furhat.say("I'll check in with you again")
        send(SPEECH_DONE)
    }

    onNoResponse {
        furhat.ask("I'm sorry, I didn't understand that. Would you like to do a calming activity?")
    }
}
