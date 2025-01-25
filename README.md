# Furhat-Study-Buddy
Read about the project on my [blog](https://maahma.github.io/maahma-portfolio/project/social_robot)
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

