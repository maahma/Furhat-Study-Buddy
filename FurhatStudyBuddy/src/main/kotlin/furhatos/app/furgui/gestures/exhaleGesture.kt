package furhatos.app.furgui.gestures

import furhatos.gestures.BasicParams
import furhatos.app.furgui.utils._defineGesture
import furhatos.gestures.Gestures

val ExhaleGesture = _defineGesture("ExhaleGesture") {
    // Mouth open to breathe out
    frame(0.1, 3.7, persist = true){
        BasicParams.PHONE_AAH to 0.4
    }

    // Tilting head down
    frame(3.35){
        BasicParams.NECK_TILT to 5.0
        BasicParams.EYE_SQUINT_LEFT to 0.3
        BasicParams.EYE_SQUINT_RIGHT to 0.3
    }
    reset(3.7)
}