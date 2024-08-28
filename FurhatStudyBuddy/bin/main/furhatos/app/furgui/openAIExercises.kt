package furhatos.app.furgui

import com.theokanning.openai.service.OpenAiService
import com.theokanning.openai.completion.CompletionRequest
import com.theokanning.openai.completion.CompletionResult
import kotlinx.coroutines.runBlocking

/** API Key to GPT-3 language model. **/
private const val SERVICE_KEY = "sk-proj-VYIxHp0hXLyGI0em6QtHT3BlbkFJ1cT2GutDATNftb0juocs"

private val service = OpenAiService(SERVICE_KEY)

class openAICalmingExercises {
    private val temperature = 0.5
    private val maxTokens = 50
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
            .model("gpt-4") // Assuming you want to use the standard GPT-4 model
            .build()

        val result = runBlocking {
            service.createCompletion(completionRequest)
        }

        return result.choices.first().text.trim()
    }
}