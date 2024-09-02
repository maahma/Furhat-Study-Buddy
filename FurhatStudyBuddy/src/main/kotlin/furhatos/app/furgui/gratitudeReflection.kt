package furhatos.app.furgui

import furhatos.flow.kotlin.*
import furhatos.app.furgui.flow.Parent
import kotlinx.coroutines.runBlocking

val GratitudeReflection: State = state(parent = Parent) {

    val openAISerenityAssistant = openAICalmingExercises()
    var startTime: Long = 0

    onEntry{
        startTime = System.currentTimeMillis()  // Start the timer
        furhat.say("Let's take a moment to reflect on the positive things in your life. Gratitude can help us feel more at peace.")
        reentry()
    }

    onReentry {
        val initialPrompt = "You're a helpful well-being assistant guiding students in reflecting on positive aspects of their life. Ask the user to share something they're grateful for and provide supportive feedback."
        val response = openAISerenityAssistant.generatePromptResponse(initialPrompt)
        furhat.say(response)
    }

    onResponse {
        val userResponse = it.text
        val followUpPrompt = "The user expressed gratitude for: \"$userResponse\". Based on this, continue encouraging them to reflect on more positive aspects of their life."
        val followUpResponse = openAISerenityAssistant.generatePromptResponse(followUpPrompt)

        furhat.say(followUpResponse)

        // Check if 2 minutes have passed
        val elapsedTime = System.currentTimeMillis() - startTime
        if (elapsedTime > 2 * 60 * 1000) {  // Exit after 2 minutes
            furhat.say("Thank you for sharing. Remember, practicing gratitude regularly can help you feel more positive and calm. Let's move on with your session.")
            send(SPEECH_DONE)
        } else {
            reentry()
        }
    }
}