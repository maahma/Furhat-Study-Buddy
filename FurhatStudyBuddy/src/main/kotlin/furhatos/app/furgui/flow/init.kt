package furhatos.app.furgui.flow

import furhatos.app.furgui.flow.Greeting
import furhatos.app.furgui.flow.Sleeping
import furhatos.app.furgui.setting.DISTANCE_TO_ENGAGE
import furhatos.app.furgui.setting.MAX_NUMBER_OF_USERS
import furhatos.flow.kotlin.State
import furhatos.flow.kotlin.furhat
import furhatos.flow.kotlin.state
import furhatos.flow.kotlin.users
import furhatos.flow.kotlin.voice.Voice

val Init: State = state() {
    init {
        /** Set our default interaction parameters */
        users.setSimpleEngagementPolicy(DISTANCE_TO_ENGAGE, MAX_NUMBER_OF_USERS)

        /** Set the persona for the interaction **/
        furhat.voice = Voice("Amy")
        furhat.character = "Isabel"

        /** start the interaction */
        when (users.count) {
            0 -> goto(Sleeping)
            1 -> {
                furhat.attend(users.random)
                goto(Greeting)
            }
        }
    }
}
