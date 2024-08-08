package furhatos.app.studybuddy

import furhatos.event.Event

// Event used to pass user login information to Furhat
class UserLoginEvent(
    val userName: String
) : Event()

// Event constants
const val USER_LOGIN_EVENT = "UserLoginEvent"