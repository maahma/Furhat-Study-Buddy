package furhatos.app.furgui

import furhatos.app.furgui.flow.*
import furhatos.flow.kotlin.*
import kotlinx.coroutines.runBlocking
import furhatos.util.Language
import furhatos.gestures.Gestures
import furhatos.records.User

val EmotionRegulation: State = state(parent = Parent) {

    val openAISerenityAssistant = openAICalmingExercises()
    var startTime: Long = 0

    onEntry {
        startTime = System.currentTimeMillis()  // Start the timer
        furhat.say("Let's take a moment to discuss how you're feeling. We can work through anything that's on your mind. You can say 'stop' anytime and go back to your study session")
        furhat.gesture(Gestures.Smile)
        furhat.ask("How are you feeling today?")
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
            Avoid starting your response with "just respond" or similar phrases, and avoid greeting the student every time you respond. 
            """.trimIndent()
        val followUpResponse = openAISerenityAssistant.generatePromptResponse(followUpPrompt)

//        furhat.ask(followUpResponse)
        furhat.say(followUpResponse)
        furhat.gesture(Gestures.Smile)
        furhat.ask("Is there anything else on your mind?")

        // Check if 2 minutes have passed
        val elapsedTime = System.currentTimeMillis() - startTime
        if (elapsedTime > 2 * 60 * 1000) {  // Exit after 2 minutes
            furhat.say("I hope you're feeling a bit better now. Let's continue with your study session. We can do another exercise if you feel overwhelmed or stressed again.")
            furhat.gesture(Gestures.Smile)
            send(SPEECH_DONE)
        }
    }

    onResponse<StopSession> {
        furhat.say("It's okay if you don't want to talk right now! Let's get back to your study session. Remember, I'm here if you need me.")
        send(SPEECH_DONE)
    }

    onResponse<TalkMore> {
        furhat.ask("I'm here to listen. What's on your mind?")
    }

    onNoResponse {
        furhat.say("It's okay if you don't want to talk right now. I'm here whenever you're ready.")
        send(SPEECH_DONE)
    }
}