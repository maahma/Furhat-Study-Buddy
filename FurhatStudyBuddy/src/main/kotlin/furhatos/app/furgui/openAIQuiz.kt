package furhatos.app.furgui

import com.theokanning.openai.OpenAiService
import com.theokanning.openai.completion.CompletionRequest
import com.theokanning.openai.completion.CompletionResult
import kotlinx.coroutines.runBlocking

/** API Key to GPT-3 language model. **/
private const val SERVICE_KEY = "sk-proj-VYIxHp0hXLyGI0em6QtHT3BlbkFJ1cT2GutDATNftb0juocs"

private val service = OpenAiService(SERVICE_KEY)

class OpenAIQuizAssistant {

    private val temperature = 0.5
    private val maxTokens = 50
    private val topP = 1.0
    private val frequencyPenalty = 0.0
    private val presencePenalty = 0.0

    fun isAnswerClose(userAnswer: String, correctAnswer: String): Boolean {
        val prompt = """
            You are a helpful quiz assistant. Compare the user's answer with the correct answer and determine if they are the same in meaning. Ignore any grammar errors in user's answers.
            User's Answer: "$userAnswer"
            Correct Answer: "$correctAnswer
            
            Respond with "Yes" if the answers are equivalent or close in meaning, otherwise respond with "No".
        """.trimIndent()

        val completionRequest = CompletionRequest.builder()
            .temperature(temperature)
            .maxTokens(maxTokens)
            .topP(topP)
            .frequencyPenalty(frequencyPenalty)
            .presencePenalty(presencePenalty)
            .prompt(prompt)
            .model("gpt-3.5-turbo-instruct")
            .build()

        return try {
            val completion: CompletionResult = runBlocking {
                service.createCompletion(completionRequest)
            }
            val response = completion.choices.firstOrNull()?.text?.trim()
            response?.equals("Yes", ignoreCase = true) ?: false
        } catch (e: Exception) {
            println("Inside openAIQuiz.kt and there's a problem with connection to OpenAI: " + e.message)
            e.printStackTrace()
            false
        }
    }
}