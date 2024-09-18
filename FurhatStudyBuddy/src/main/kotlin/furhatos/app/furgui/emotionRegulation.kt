package furhatos.app.furgui

import furhatos.app.furgui.flow.*
import furhatos.app.furgui.gestures.LookingAway
import furhatos.app.furgui.gestures.SlightNod
import furhatos.flow.kotlin.*
import kotlinx.coroutines.runBlocking
import furhatos.util.Language
import furhatos.gestures.Gestures
import furhatos.records.User

val EmotionRegulation: State = state(parent = Parent) {

    val openAISerenityAssistant = openAICalmingExercises()

    onEntry {
        furhat.ask("Let's talk about how you're feeling today. Feel free to take your time and share what's on your mind. You can say 'stop' anytime and go back to your study session.", endSil = 2000, maxSpeech = 30000)
    }

    // onInterimResponse handles interim speech results
    onInterimResponse(endSil = 500) {
        // Provide real-time feedback while the user is still speaking
        furhat.gesture(Gestures.Smile)
        furhat.gesture(SlightNod)
    }

    onResponse<StopSession> {
        furhat.say("It's okay if you don't want to talk right now! Let's get back to your study session. Remember, I'm here if you need me.")
        send(SPEECH_DONE)
    }

    onResponse {
        val userResponse = it.text

        val followUpPrompt = """
            You are a supportive and empathetic well-being assistant engaging in a conversation with a student.  
            The user said: "$userResponse". 
            Provide a caring and conversational response as if you are actively listening and engaging with the student. 
            Acknowledge their feelings, and offer a practical strategy to help them manage their emotions. For example, you might suggest taking a short break to relax and clear their mind.
            Avoid starting your response with "just respond" or similar phrases, and avoid greeting the student every time you respond.
            Don't make the responses too long.
            """.trimIndent()

//        val thinking = utterance {
//            +"Hmm,"
//            + LookingAway
//            +"Let me think"
//        }
//
//        furhat.say(thinking)

        furhat.say("Hmm")
        furhat.gesture(GazeAversion(4.0), async=true)

//        Ensure your response shows that you value the student's feelings and are here to support them, and provide actionable advice to help them navigate their emotions.
        val followUpResponse = openAISerenityAssistant.generatePromptResponse(followUpPrompt)

        furhat.gesture(GazeAversion(2.0))

        furhat.say(followUpResponse)
        furhat.gesture(Gestures.Smile)

        furhat.ask("", endSil = 2000, maxSpeech = 30000)
    }

    // onInterimResponse handles interim speech results
    onInterimResponse(endSil = 500) {
        // Provide real-time feedback while the user is still speaking
        furhat.gesture(SlightNod)
    }

    onResponse<StopSession> {
        furhat.say("It's okay if you don't want to talk right now! Let's get back to your study session. Remember, I'm here if you need me.")
        send(SPEECH_DONE)
    }

    onNoResponse {
        furhat.say("It's okay if you don't want to talk right now.")
        furhat.gesture(Gestures.Smile)
        furhat.say("I'll check in with you again")
        send(SPEECH_DONE)
    }
}