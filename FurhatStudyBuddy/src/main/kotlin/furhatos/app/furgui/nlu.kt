package furhatos.app.furgui

import furhatos.nlu.EnumEntity
import furhatos.nlu.EnumItem
import furhatos.nlu.Intent
import furhatos.util.Language

class DontKnow : Intent() {
    override fun getExamples(lang: Language): List<String> {
        return listOf(
            "I don't know",
            "don't know",
            "no idea",
            "I have no idea"
        )
    }
}

class SkipQuestion : Intent() {
    override fun getExamples(lang: Language): List<String> {
        return listOf(
            "skip",
            "skip this",
            "next question",
            "move on"
        )
    }
}

class StopQuiz : Intent() {
    override fun getExamples(lang: Language): List<String> {
        return listOf(
            "stop",
            "end quiz",
            "quit quiz",
            "stop the quiz"
        )
    }
}

class Yes : Intent() {
    override fun getExamples(lang: Language): List<String> {
        return listOf(
            "yes",
            "sure",
            "okay",
            "let's do it"
        )
    }
}

class No : Intent() {
    override fun getExamples(lang: Language): List<String> {
        return listOf(
            "no",
            "no thanks",
            "not now",
            "maybe later"
        )
    }
}

class RequestRules : Intent() {
    override fun getExamples(lang: Language): List<String> {
        return listOf(
            "what are the rules",
            "how does it work",
            "explain the rules"
        )
    }
}

class RequestRepeatQuestion : Intent() {
    override fun getExamples(lang: Language): List<String> {
        return listOf(
            "what was the question",
            "can you repeat the question",
            "what was the question again"
        )
    }
}