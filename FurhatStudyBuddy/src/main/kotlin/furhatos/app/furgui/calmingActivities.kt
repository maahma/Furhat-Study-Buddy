package furhatos.app.furgui

import furhatos.app.furgui.flow.*
import furhatos.flow.kotlin.*
import furhatos.gestures.Gestures
import furhatos.nlu.common.Greeting
import furhatos.records.Location
import furhatos.app.furgui.gestures.*
import kotlin.random.Random

val CalmingActivity: State = state(parent = Parent) {
    val openAISerenityAssistant = openAICalmingExercises()

    onEntry {
        furhat.say("Let's do a calming activity together.")

        val activity = Random.nextInt(3)

        when (activity) {
            0 -> goto(BreathingExerciseState)
            1 -> goto(EmotionRegulation)
            2 -> goto(GratitudeReflection)
        }

        furhat.say("I hope you feel more relaxed now.")
    }
}
