package furhatos.app.furgui.utils

import furhatos.gestures.*
import furhatos.records.Pixel
import furhatos.records.Record
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader

var isVirtual = false

// Random double in given range
fun getRandomInRange(startInterval: Double = 18.0, interval: Double = 3.0) = startInterval + Math.random() * interval

fun getAudioURL(path: String) : String {
    return if(isVirtual) {
        "file:${File(".").canonicalPath + "/src/main/resources/sounds/"}$path"
    } else {
        "classpath:sounds/$path"
    }
}

fun _defineGesture(name: String? = null,
                   strength: Double = 1.0,
                   duration: Double = 1.0,
                   defaultPriority: Int = 0,
                   frameTimes: List<Double>? = null,
                   audioURL: String? = null,
                   texture: String? = null,
                   ledPixel: Pixel? = null,
                   definition: GestureBuilder.() -> Unit): Gesture {
    val gesture = defineGesture(name, strength, duration, defaultPriority, definition)

    if(frameTimes != null) {
        gesture.frames.add(Frame(frameTimes, false, audioURL, texture, texture, ledPixel))
    }


    return gesture
}