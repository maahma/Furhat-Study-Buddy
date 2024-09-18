package furhatos.app.furgui

import furhatos.flow.kotlin.*
import furhatos.app.furgui.flow.Parent
import furhatos.app.furgui.gestures.LookingAway
import furhatos.app.furgui.gestures.SlightNod
import furhatos.gestures.Gestures
import kotlinx.coroutines.runBlocking

val GratitudeReflection: State = state(parent = Parent) {

    val openAISerenityAssistant = openAICalmingExercises()

    onEntry{
        furhat.say("Taking a moment to reflect on the positive aspects of your life can really uplift your mood. Let's focus on something that brings you joy or makes you feel thankful.")
        furhat.gesture(Gestures.Smile)
        furhat.ask("Can you share one thing you're grateful for today? If you prefer to return to your study session, just say 'stop' and we'll switch back.", endSil = 2000, maxSpeech = 30000)
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

    onResponse {
        val userResponse = it.text

//        val thinking = utterance {
//            +"Hmm,"
//            + LookingAway
//            +"Let me think"
//            + delay(9000)
//        }


        val followUpPrompt = """
            You are a supportive and empathetic well-being assistant engaging in a conversation with a student.
            The user said: "$userResponse".
            Provide a caring and supportive response, reflecting on the user's gratitude and reinforcing the positive aspect they shared. Use phrases like "That's wonderful" or "I'm glad to hear that".
            Avoid starting your response with "just respond" or similar phrases, avoid greeting the student every time you respond, and avoid saying [student's name] or similar phrases.
            Ensure your response shows that you value the student's feelings and are here to support them.
            """.trimIndent()

//        furhat.say(thinking)

        furhat.say("Hmm")
        furhat.gesture(GazeAversion(4.0), async=true)

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
        furhat.gesture(Gestures.Smile)
        send(SPEECH_DONE)
    }

    onNoResponse {
        furhat.say("It's okay if you don't want to talk right now.")
        furhat.gesture(Gestures.Smile)
        furhat.say("I'll check in with you again")
        send(SPEECH_DONE)
    }
}