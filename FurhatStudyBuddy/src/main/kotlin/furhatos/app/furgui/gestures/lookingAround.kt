package furhatos.app.furgui.gestures

import furhatos.gestures.BasicParams
import furhatos.app.furgui.utils._defineGesture

/**
 * Shake head slowly
 */
val LookingAround = _defineGesture("LookingAround") {

    frame(0.5){}
    frame(0.5, 1.5){
        BasicParams.GAZE_TILT to 25
        BasicParams.NECK_PAN to 25.0

        BasicParams.BROW_UP_LEFT to 2.0
        BasicParams.BROW_UP_RIGHT to 2.0
    }

    frame(1.6, 1.8){}
    frame(1.9, 3.3){
        BasicParams.GAZE_TILT to -25
        BasicParams.NECK_PAN to -25.0

        BasicParams.BROW_UP_LEFT to 2.0
        BasicParams.BROW_UP_RIGHT to 2.0
    }

    reset(3.5)
}