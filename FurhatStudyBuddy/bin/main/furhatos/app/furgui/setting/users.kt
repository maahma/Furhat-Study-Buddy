package furhatos.app.furgui.setting

import furhatos.flow.kotlin.UserDataDelegate
import furhatos.records.User
import furhatos.app.furgui.QuestionData

var User.quizQuestions: List<QuestionData>? by UserDataDelegate()
var User.incorrectQuestions: MutableList<QuestionData>? by UserDataDelegate()