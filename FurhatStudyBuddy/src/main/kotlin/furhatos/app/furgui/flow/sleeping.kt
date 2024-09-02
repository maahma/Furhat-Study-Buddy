package furhatos.app.furgui.flow

import furhat.libraries.standard.GesturesLib
import furhatos.flow.kotlin.*
import furhatos.app.furgui.gestures.*
import furhatos.gestures.Gestures

val Sleeping: State = state {
    onEntry{
        furhat.attendNobody()
//        furhat.gesture(GesturesLib.PerformFallAsleepPersist)
        furhat.gesture(LookingAround)
        furhat.say("I can't see anyone. Step closer please.")
    }

    onUserEnter {
        furhat.gesture(Gestures.Smile)
//        furhat.gesture(GesturesLib.PerformWakeUpWithHeadShake)
        furhat.attend(it) // it = user that entered
        goto(Greeting)
    }
}