package furhatos.app.furgui

import furhatos.app.furgui.flow.Parent
import furhatos.flow.kotlin.*
import furhatos.gestures.Gestures
import furhatos.app.furgui.gestures.*

val BreathingExerciseState: State = state(parent = Parent) {

    onEntry {
        furhat.say("Let's begin with a simple breathing exercise.")
        furhat.say("Breathe in through your nose.")
        furhat.gesture(InhaleGesture)
        furhat.say("Hold it for a moment.", async = true)
        delay(3000)  // Hold inhale posture for 3 seconds
        furhat.say("Now, slowly breathe out through your mouth.", async = true)

        furhat.gesture(ExhaleGesture)
        delay(3000)  // Hold exhale posture for 3 seconds

        furhat.say("Let's repeat this a few times.")

        repeat(3) {
            furhat.say("Breathe in.", async = true)
            furhat.gesture(InhaleGesture)
            delay(3000)  // Hold inhale posture for 3 seconds
            furhat.say("And out.", async = true)
            furhat.gesture(ExhaleGesture)
            delay(3000)  // Hold exhale posture for 3 seconds
        }

        furhat.say("Great job. Let's continue with your study session now.")
    }
}