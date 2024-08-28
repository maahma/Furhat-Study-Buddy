package furhatos.app.furgui.flow

import furhatos.flow.kotlin.*
import furhatos.event.senses.SenseSkillGUIConnected
import furhatos.records.Record
import furhatos.app.furgui.flow.*
import furhatos.app.furgui.*

val GREET_USER = "GreetUser"
val DASHBOARD_LOADED = "DashboardLoaded"
val FOCUS_TIMER = "FocusTimer"
val QUIZ_PAGE = "QuizPage"
val QUIZ_ME = "QuizMe"
val CALMING_ACTIVITY = "CalmingActivity"

val Parent: State = state {

    onUserLeave(instant = true) {
        when {
            users.count == 0 -> goto(Sleeping) // No users left, so Furhat should "sleep"
            it == users.current -> furhat.attend(users.other) // Attend to the next user
        }
    }

    onUserEnter(instant = true) {
        furhat.glance(it) // Glance at the new user
    }

    // Global event handlers
    onEvent(GREET_USER) {
        val userName = it.get("data")
        furhat.say("Hello $userName! Great to see you here!")
        send(SPEECH_DONE)
    }

    onEvent(DASHBOARD_LOADED) {
        furhat.say("This is your dashboard, where you can add and view your deadlines and classes.")
        send(SPEECH_DONE)
    }

    onEvent(FOCUS_TIMER) {
        furhat.say("You can generate a schedule on this page and start a study session. I’ll be with you throughout the session to help manage your mood by offering to do calming activities if I sense that you're feeling overwhelmed.")
        send(SPEECH_DONE)
    }

    onEvent(QUIZ_PAGE) {
        furhat.say("You can type your notes in the box below and let me quiz you.")
        send(SPEECH_DONE)
    }

    onEvent(QUIZ_ME) {
        val recordList = it.get("data") as? List<Record>

        if (recordList != null) {
            // Convert the list of Records to a list of QuestionData
            quizQuestions = recordList.mapNotNull { record ->
                // Convert Record to Map
                val questionText = record["questionText"] as? String
                val answerText = record["answerText"] as? String

                if (questionText != null && answerText != null) {
                    QuestionData(questionText, answerText)
                } else {
                    null
                }
            }

            furhat.say("Let's start the quiz!")
            goto(QuizState)
        } else {
            furhat.say("Failed to retrieve quiz questions.")
            send(SPEECH_DONE)
        }
    }

    onEvent(CALMING_ACTIVITY) {
        goto(CalmingActivity)
    }
}