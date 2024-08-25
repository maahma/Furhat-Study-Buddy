package furhatos.app.furgui

import furhatos.flow.kotlin.*
import kotlinx.coroutines.runBlocking

val EmotionRegulation: State = state {

    val openAISerenityAssistant = openAICalmingExercises()
    var startTime: Long = 0

    onEntry{
        startTime = System.currentTimeMillis()  // Start the timer
        furhat.say("Let's take a moment to discuss how you're feeling. We can work through anything that's on your mind.")
        reentry()
    }

    onReentry {
        val initialPrompt = "You're a helpful well-being assistant guiding students in understanding and managing their emotions. Ask the user how they are feeling and provide supportive guidance."
        val response = openAISerenityAssistant.generatePromptResponse(initialPrompt)
        furhat.say(response)
    }

    onResponse {
        val userResponse = it.text
        val followUpPrompt = "The user said: \"$userResponse\". Based on this, continue providing supportive guidance to help them understand and manage their emotions."
        val followUpResponse = openAISerenityAssistant.generatePromptResponse(followUpPrompt)

        furhat.say(followUpResponse)

        // Check if 2 minutes have passed
        val elapsedTime = System.currentTimeMillis() - startTime
        if (elapsedTime > 2 * 60 * 1000) {  // Exit after 2 minutes
            furhat.say("I hope you're feeling a bit better now. Let's continue with your study session. We will do another exercise if you feel overwhelmed or stressed again during your study session")
            send(SPEECH_DONE)
        } else {
            reentry()
        }
    }
}