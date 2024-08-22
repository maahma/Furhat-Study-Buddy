package furhatos.app.furgui

import furhatos.skills.Skill
import furhatos.flow.kotlin.*
import furhatos.app.furgui.flow.*

class FurhatStudyBuddySkill : Skill() {
    override fun start() {
        Flow().run(NoGUI)
    }
}

// ADD TO VM IN RUN CONFIGURATION IF TESTING ON ACTUAL ROBOT AND REMOVE IT IF TESTING ON SDK
//-Dfurhatos.skills.brokeraddress={192.168.137.170}/
fun main(args: Array<String>) {
    Skill.main(args)
}
