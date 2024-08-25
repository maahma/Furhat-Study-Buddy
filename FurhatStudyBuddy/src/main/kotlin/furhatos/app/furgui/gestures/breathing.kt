package furhatos.app.furgui.gestures

import furhatos.gestures.BasicParams
import furhatos.app.furgui.utils._defineGesture
import furhatos.gestures.Gestures

val BreathingGesture = _defineGesture("BreathingGesture") {
    // Inhale phase
    // Closing the eyes
    frame(0.1, persist = true) {
        BasicParams.BLINK_RIGHT to 1.0
        BasicParams.BLINK_LEFT to 1.0
    }

    // Tilting the head up
    frame(0.35){
        BasicParams.PHONE_AAH to 0.0
        BasicParams.NECK_TILT to -14.0
    }

    frame(0.7){
        BasicParams.NECK_TILT to -14.0
    }

    // Mouth open to breathe out
    frame(1.5, 5.8, persist = true){
        BasicParams.PHONE_AAH to 0.4
    }

    // Tilting head down
    frame(5.8){
        BasicParams.NECK_TILT to 5.0
        BasicParams.EYE_SQUINT_LEFT to 0.3
        BasicParams.EYE_SQUINT_RIGHT to 0.3
    }
    reset(6.2)
}






