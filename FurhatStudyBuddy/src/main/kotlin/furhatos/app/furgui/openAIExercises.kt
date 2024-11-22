package furhatos.app.furgui

import com.theokanning.openai.OpenAiService
import com.theokanning.openai.completion.CompletionRequest
import com.theokanning.openai.completion.CompletionResult
import kotlinx.coroutines.runBlocking

/** API Key to GPT-3 language model. **/
private const val SERVICE_KEY = <secret key>

private val service = OpenAiService(SERVICE_KEY)

class openAICalmingExercises {
    private val temperature = 0.5
    private val maxTokens = 200
    private val topP = 1.0
    private val frequencyPenalty = 0.0
    private val presencePenalty = 0.0

    fun generatePromptResponse(prompt: String): String {

        val completionRequest = CompletionRequest.builder()
            .temperature(temperature)
            .maxTokens(maxTokens)
            .topP(topP)
            .frequencyPenalty(frequencyPenalty)
            .presencePenalty(presencePenalty)
            .prompt(prompt)
            .model("gpt-3.5-turbo-instruct")
            .build()

        val result = runBlocking {
            service.createCompletion(completionRequest)
        }

        return result.choices.first().text.trim()
    }
}
