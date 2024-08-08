package furhatos.app.studybuddy

import furhatos.skills.Skill
import furhatos.flow.kotlin.*

class FurhatStudyBuddySkill : Skill() {
    override fun start() {
        Flow().run(NoGUI)
    }
}

fun main(args: Array<String>) {
    Skill.main(args)
}