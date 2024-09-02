package furhatos.app.furgui.gestures

import furhatos.gestures.BasicParams
import furhatos.app.furgui.utils._defineGesture

/**
 * Look away to show thinking
 */
val LookingAway = _defineGesture("LookingAway") {

    frame(0.5){}
    frame(0.5, 2.0){
        BasicParams.GAZE_TILT to 25
        BasicParams.NECK_TILT to 12
        BasicParams.NECK_PAN to 25.0

        BasicParams.EYE_SQUINT_LEFT to 0.5
        BasicParams.EYE_SQUINT_RIGHT to 0.5
    }

    frame(2.1, 2.2){}

    reset(2.5)
}