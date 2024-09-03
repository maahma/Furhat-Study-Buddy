package furhatos.app.furgui.gestures

import furhatos.gestures.BasicParams
import furhatos.app.furgui.utils._defineGesture

/**
 * Nod to show that you're listening
 */
val SlightNod = _defineGesture("SlightNod") {

    frame(0.5){}
    frame(0.5, 1.0){
        BasicParams.SMILE_CLOSED to 0.5
        BasicParams.NECK_TILT to 5
    }

    frame(1.0, 1.5){
        BasicParams.SMILE_CLOSED to 0.5
        BasicParams.NECK_TILT to -5
    }

    frame(1.5, 2.0){
        BasicParams.SMILE_CLOSED to 0.5
        BasicParams.NECK_TILT to 5
    }

    frame(2.0, 2.5){
        BasicParams.SMILE_CLOSED to 0.5
        BasicParams.NECK_TILT to -5
    }

    reset(2.8)
}