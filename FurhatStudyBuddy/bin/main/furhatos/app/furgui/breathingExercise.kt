package furhatos.app.furgui

import furhatos.app.furgui.flow.Parent
import furhatos.flow.kotlin.*
import furhatos.gestures.Gestures
import furhatos.app.furgui.gestures.*

val BreathingExerciseState: State = state {

    onEntry {
        furhat.say("Let's begin with a simple breathing exercise. Breathe in deeply through your nose.")
        furhat.gesture(InhaleGesture)
        furhat.say("Hold it for a moment.")
        furhat.say("Now, slowly breathe out through your mouth.")
        furhat.gesture(ExhaleGesture)

        furhat.say("Let's repeat this a few times.")

        repeat(3) {
            furhat.say("Breathe in.")
            furhat.gesture(InhaleGesture)
            furhat.say("And out.")
            furhat.gesture(ExhaleGesture)
        }

        furhat.say("Great job. Let's continue with your study session now.")
    }
}