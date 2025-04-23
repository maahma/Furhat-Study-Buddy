# Furhat Study Buddy

## About the Project
This project was developed as part of my Master’s dissertation, where I was tasked with creating a skill for the Furhat Robot. The requirement was open-ended—as long as the robot was used effectively, the skill could serve any purpose.

I began by exploring previous student projects, which included Furhat being used as a receptionist or a language learning assistant. Inspired by these ideas, I wanted to build something personally meaningful and practically useful for students like myself. That’s when I came up with the idea of designing Furhat as a Study Buddy—a robot that could support learning, help manage study stress, and enhance productivity through interactive sessions. Watch a video of the project on my [blog](https://maahma.github.io/maahma-portfolio/project/social_robot)

I'll explain the system architecture first to introduce the components used in this project

## System Architecture
The architecture of this project revolves around three core components:
1) <b>MERN Application</b>
    - The web application is built using the MERN stack:
        - MongoDB for the database
        - Express.js for the backend framework
        - React for the front-end UI
        - Node.js as the runtime environment
    - The application interfaces with both the Furhat robot and the FaceReader software to manage data flow and interactions.
2) <b>Furhat Robot</b>
    - Furhat is a back-projected social robot developed by Furhat Robotics in Sweden. It allows facial customization (e.g., eye size, gender, skin tone) and features:
        - Realistic face movements via animated projection
        - Natural gestures (nodding, eyebrow movement)
        - Sophisticated head motion platform
        - Onboard audio and visual sensors
        - Ample processing power and standard I/O ports
    - It communicates with the MERN application to handle human-robot interactions.
3) <b>FaceReader Software</b>
    - FaceReader by Noldus is a commercial software that detects and classifies facial expressions into basic emotional categories: happy, sad, angry, surprised, scared, disgusted, and neutral. It operates in three main steps:
      - **Face Finding**: Uses deep learning to locate faces in images
      - **Face Modelling**: Builds a 3D facial model with 468 key points and compresses it using PCA.
      - **Face Classification**: Classifies expressions using a trained deep neural network, providing intensity values between 0 (absent) and 1 (fully present). It also calculates valence (positive/negative emotional state).
    - It sends emotional data to, and receives requests from, the MERN application to inform emotional analysis and well-being activities.

At high level, the interaction between the 3 components looks like this: 
<br>

![high-level-design](https://github.com/user-attachments/assets/19153cb6-a5de-445b-a574-e09fb7e0a074)


## What the project does
This project turns the Furhat Robot into a smart and empathetic Study Buddy designed to help students stay on track with their academics and mental well-being.
1) **📆 Smart Study Schedule with Well-being Monitoring**
- Users can input their class schedules and assignment deadlines into the web application. The system then generates a personalized study schedule with allocated 60-minute study slots using OpenAI Chat Completions API. Each session comes with a built-in Pomodoro timer, and starting it also launches FaceReader, which analyzes the student’s facial expressions in real time.
- If negative emotions like sadness, anger, or fear are detected 5 times, the system triggers the Furhat Robot to guide the user through calming activities such as:
    - Deep breathing
    - Emotion regulation
    - Gratitude reflection

2) **🧠 AI-Generated Quiz from Study Notes**
- Users can input their study notes, and the app generates a 20-question quiz using OpenAI Chat Completions API. The Furhat Robot then:
    - Asks the quiz questions aloud
    - Tracks which answers the user got wrong
    - Re-quizzes the user on incorrect answers to reinforce learning
 

## Requirements 
I divided the functional requirements into two parts:
    - those for students
    - and those for well-being advisors
These requirements were prioritised using the MoSCoW technique (Must Have, Should Have, Could Have, Won't Have) technique. All requirements designated as "Must Have" have been successfully implemented to ensure the delivery of a minimum viable product within the specied time frame.
  
| Priority     | Requirement | Acceptance Criteria |
|--------------|-------------|---------------------|
| Must Have | The application must allow students to create an account using a university or personal email. | - Students can securely create an account using a valid email address |
| Must Have | The application must allow students to input their class timetable and deadlines to generate a personalised study schedule | - The application allows users to perform CRUD operations for deadlines and classes <br> - The personalised study schedule is generated using OpenAI LLM <br> - The schedule accommodates varying class times and deadlines |
| Must Have | The application must create a study schedule that includes breaks for meals and other activities | - Predefined breaks for meals and relaxation are included <br> - Breaks are incorporated into the OpenAI LLM prompt |
| Must Have | The application must break down tasks into smaller chunks and create a to-do list | - A task is generated for each study session <br> - The OpenAI prompt includes task breakdown instructions |
| Must Have | The application must start a timer for each study session | - A timer is linked to each session <br> - The timer can be started, stopped, and reset |
| Must Have | The application must monitor the student’s mood during tasks to recognize distress | - Facial emotion recognition software analyses expressions <br> - Detects distress signals <br> - Mood data is continuously monitored |
| Must Have | The application must suggest taking a break and provide motivational support if the student appears distressed | - Furhat receives mood data <br> - Suggests a break and performs calming activities |
| Must Have | The application must allow students to input their notes and automatically create flashcards | - Users input notes via interface <br> - “Quiz Me” button generates quizzes <br> - OpenAI LLM creates questions/answers <br> - Users can view notes and be quizzed on them |
| Must Have | The Furhat robot must quiz students using flashcards | - Quiz questions are sent to Furhat <br> - A Furhat skill handles asking and receiving answers |
| Must Have | The Furhat robot must provide feedback on quiz answers | - Answers are compared to correct ones <br> - Immediate feedback is provided <br> - Incorrect answers can be reviewed and retried |
| Should Have | The application should allow students to set their preferred start and end times for the day | - Input start/end times via interface <br> - Supports 24-hour or AM/PM format <br> - Validates time inputs <br> - Times are passed to OpenAI LLM |
| Should Have | The application should allow students to specify the number of hours they wish to study each day | - Users specify study hours via input/slider <br> - Hours are passed to OpenAI LLM |
| Should Have | The application should send reminders for students to check off tasks from their to-do list | - Tasks tracked and reminders sent <br> - Users can check off tasks <br> - Status updates in real-time |
| Could Have | The application could allow students to customise the Furhat robot's voice, appearance, or interface | - Settings page for customisation <br> - Changes apply immediately |
| Could Have | The application could allow students to type their responses if Furhat doesn't recognize spoken input | - Text input during quiz interactions <br> - Both spoken and typed inputs are accepted |
| Could Have | The application could provide a dashboard for well-being advisors to monitor student progress and engagement | - Dashboard displays completed tasks, study hours, and engagement |
| Could Have | The application could allow well-being advisors to customise motivational messages and relaxation techniques | - Advisors can update prompts via a settings panel |
| Won’t Have | The application will not engage in conversations with students at risk of burnout in the current iteration | - Provides manual or OpenAI prompt for supportive dialogues <br> - Furhat guides students to contact advisors |
| Won’t Have | The application will not include scheduled wellness check-ins via Furhat in the current iteration | - Furhat asks about stress, challenges, well-being <br> - Customizable check-in questions <br> - Responses accessible to advisors |

## Using OpenAI's Chat Completions API
For conversational purposes, OpenAI offers the Chat Completions API, which is optimized for generating interactive and natural-sounding text using GPT models. This API is a part of OpenAI's broader text generation capabilities, where user inputs are referred to as prompts. **_Prompt engineering_** is an emerging field focused on crafting effective prompts to use the full potential of large language models across various tasks and domains. It helps users understand both the strengths and limitations of these models <br>

According to OpenAI’s API documentation, six core strategies can improve the quality of results:
- Writing clear instructions by being specific about output length, format, and examples
- Providing reference text and citations to guide the model
- Breaking down complex tasks into simpler components and summarizing long texts
- Giving the model time to think and reviewing previous outputs
- Using tools like text retrieval and code execution for better results
- Testing changes systematically to measure the impact of prompt changes
<br>

In this application, the Chat Completions API was used to:
- Generate personalized study schedules based on user inputs
- Create quiz questions from user notes
- Provide contextual, emotionally-aware responses through the Furhat Robot during calming activities
<br>

An example of prompt engineering used in this project is the prompt created to generate a personalized study schedule:
<br>

![final-prompt](https://github.com/user-attachments/assets/ad9ad17e-a06b-4fd1-8a61-d38cd8eec140)

It takes a list of class schedules and upcoming deadlines as input and constructs a series of structured messages. These messages:
- Define the assistant's role as a study scheduler
- Include detailed instructions and preferences such as study hours, class days, and subject priorities
- Ensure the model aligns the schedule with the user’s upcoming deadlines

This approach allows the assistant to simulate thoughtful planning and return a tailored study plan that considers workload distribution, rest periods, and academic priorities.

## Sprints Breakdown
1) **Sprint 1**
    - Set up the MERN application's server
    - Configure and establish the MongoDB database
    - Connect the front end to the back end
    - Implement basic CRUD functionalities for classes and deadlines
    - Apply initial styling to the user interface
2) **Sprint 2**
    - Develop a study session and quiz generator using OpenAI's LLM
    - Begin integration with the Furhat robot
    - Address connectivity issues between the MERN app and Furhat
3) **Sprint 3**
    - Integrate the MERN application with FaceReader software
    - Continue resolving Furhat connectivity
    - Develop a Furhat skill to quiz users on their study notes
4) **Sprint 4**
    - Analyze facial expressions using FaceReader
    - Trigger Furhat to perform calming activities
    - Conduct functional testing for CRUD operations and system interactions

I used the following GANTT Chart (not the full chart shown here) to keep a track of the Sprints:
<br>

![gantt-chart](https://github.com/user-attachments/assets/f9973230-f8b6-4103-9ff6-ff873585117f)


## Project File Structure
The project is divided into four main folders:
1) ```front-end``` folder has ```App.js``` which is the entry point for the React application, and sets up routing and integrates UI components
2) ```back-end``` folder has ```server.js``` which initializes the Node.js server, connects to MongoDB, handles API requests and manages authentication and CRUD operations
3) ```FaceReaderSetup``` folder has ```server.js``` which hosts a Node.js server that communicates with FaceReader via TCP/IP. It starts/stops emotion recognition, processes emotional data and triggers responses in the MERN application
4) ```FurhatStudyBuddy``` folder has ```main.kt``` which is the entry point for the Furhat skill. It sets up the Furhat environment for the real robot or SDK mode. It manages dialogue flows and integration with the MERN application

## Setting up the MERN Application
### Prerequisites
#### Installing Node.js and npm
- Download the latest version of Node.js and npm suitable for the operating system from the Node.js website.
- To verify the installation, open the command line interface (CLI) and run: `node --version`
- If Node.js is installed, it will display the version number. If not, download and install Node.js following the instructions on the website.
- Check if npm is installed and working by running: `npm -v`
- Ensure the npm version is 8.19.2 or higher. If it’s not up-to-date, upgrade npm by running: `npm install -g npm@latest`
#### Cloning the repository
- Navigate to the desired location on your system and clone the repository by running: `git clone https://github.com/maahma/Furhat-Study-Buddy.git`
#### Running the Front-end
- After cloning the folder, installing `node` and `npm`, navigate to the front-end directory of the application: `cd Furhat-Study-Buddy/front-end`
- Install front-end dependencies by running : `npm install`
- Start the front-end development server: `npm start`
- This will start a local development server running on port `3000`
#### Running the Back-end
- Go back to the root folder and then navigate to the back-end directory: `cd ../back-end`
- Install back-end dependencies by running: `npm install`
- Start the back-end server: `nodemon server.js`
- This will start the server on port `6005`
- Ensure both the front-end and back-end servers are running simultaneously for the application to work properly.
## Setting Up FaceReader
To install the [FaceReader software](https://www.noldus.com/facereader), ensure your device meets the following technical specifications:
### Minimum PC Requirements
- **Operating System**: Windows 11 or Windows 10 (64-bit, Professional Edition)
- **Processor**: Intel Core i7 11700 (8 Core), 2.5 GHz or better
- **Internal Memory**: 8 GB or more
- **Hard Drive**: 1 TB
- **Graphics Card**: 2 GB NVIDIA Quadro P400 or better
### Installation Steps
- Download FaceReader 9.1 from the FaceReader website
- Install the software on your device by following the installation prompts
- Upon launching the software, select the option to **Activate the software licence**
- Opt to use the software as a floating licence
- Use the activation key provided with your purchase to complete the setup
### Post-Installation Setup
1. After installing FaceReader, start a new project and specify a location to store it
2. Enable external control:
    - Navigate to **File → Settings**
    - Select **Data Export** from the menu
    - Check the option for **Enable external control**
    - Set the **External connection port** to **9090**
    - Scroll down in the **Data Export** section, and select the following options under **Export (Detailed log, ODX, N-Linx, and API)**, and click **OK**
3. In the Participants window, click on the first button to add a new participant
4. Click the third button in the Participants window to add camera analysis and keep the settings at their default values.

After setting up the participant and camera analysis, FaceReader will access your camera and open the analysis window. During interaction with the application, if the user starts the timer, FaceReader will analyze emotions. However, if the user stops the timer and then starts it again, they will need to add a new camera analysis; otherwise, the system will replay the previous analysis instead of starting a new one

### Running the FaceReader Node.js Server
- Navigate to the `Furhat-Study-Buddy/FaceReaderSetup` folder in the terminal
- Install the required dependencies by running the following command: `npm install`
- Start the server by running: `node server.js`
- The server will start on port `5051`

## Setting Up Furhat
### Using the Virtual Furhat Robot
#### Install the Furhat SDK
- Download the [Furhat SDK](https://www.furhatrobotics.com/furhat-sdk) from the Furhat official website
- Click on the **Get SDK** button and follow the installation instructions
- After installation, launch the SDK and click on **Launch Virtual Furhat**. This will open a window displaying the virtual Furhat
- Click on the **Open web interface** button to access the Furhat web interface
#### Download IntelliJ IDE
- To run the Furhat Skill, download IntelliJ IDE from IntelliJ Installation Guide
- Choose the version appropriate for the operating system and install it
#### Open Project in IntelliJ
- After installation, open the `FurhatStudyBuddy` folder in IntelliJ by navigating to **File → Open** and selecting `Furhat-Study-Buddy/FurhatStudyBuddy`
#### Build and Run the Application
- Navigate to the `FurhatStudyBuddy` folder in the IntelliJ terminal
- Run `gradle build` to build the application and install dependencies specified in the Gradle file
- Right click on the `main.kt` file under the `src` directory and select `Run Main.kt` to run the skill
- The skill will run in the web interface and can be accessed via the button at the top called `FurhatStudyBuddy` which will display the MERN application front-end

### Using the physical Furhat Robot
#### Required Cables and Adapters
- Ethernet connection cables (2): One for connecting the device to the Ethernet port and one for connecting Furhat to the device
- Keyboard (1): For entering the password of the mobile hotspot established by the device
- USB-C to Ethernet adapter or HDMI cable: Depending on the device’s connection type, to connect the device with Furhat
#### Establish Ethernet Connection
- Register the device on the  network via a web browser
- After registration, set up a mobile hotspot on the device
- Navigate to the Network settings on the device and share the Ethernet connection via a hotspot. The exact settings will vary based on the operating system. Use a simple username and password for the hotspot.
#### Connect Furhat to the Network
- Once a hotspot is established, press the middle button on the Furhat robot to display the menu
- Rotate the outer ring or use the arrow keys on the keyboard to navigate to **Manage Network**. Press **Enter**
- Select **Manage Wi-Fi** and choose the mobile hotspot established by the device
- Enter the hotspot password using the connected keyboard
- Once connected, the base light on the Furhat robot will turn from red to white, and the IP address will be displayed on its face
#### Access the Web Interface
- Press the middle button on the Furhat robot to display the IP address
- Enter this IP address into a web browser to access the Furhat web interface. Enter password
- In IntelliJ, navigate to the FurhatStudyBuddy folder in the terminal and run `gradle build` to build the application and install dependencies
- Navigate to **Run → Edit** Configurations in the header bar. This will display the **Run/Debug** Configurations window
- In the configurations for the `MainKt` file, locate the VM options field, and enter the following: `-Dfurhatos.skills.brokeraddress=<IP of the physical robot>`, replacing `<IP of the physical robot>` with the actual IP address of the physical Furhat robot
- Click **OK** to save the configuration
- Right click on the `main.kt` file under the `src` directory and select `Run Main.kt` to run the skill
- The skill will run in the web interface and can be accessed via the button at the top called `FurhatStudyBuddy` which will display the MERN application front-end.

Once the application is accessible through the web interface, users can begin interacting with
the system.

