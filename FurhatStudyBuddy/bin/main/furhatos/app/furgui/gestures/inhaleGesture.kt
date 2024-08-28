package furhatos.app.furgui.gestures

import furhatos.gestures.BasicParams
import furhatos.app.furgui.utils._defineGesture
import furhatos.gestures.Gestures

val InhaleGesture = _defineGesture("InhaleGesture") {
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
}






