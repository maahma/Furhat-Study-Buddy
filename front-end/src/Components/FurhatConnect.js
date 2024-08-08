// import React, { useEffect } from 'react';
// import FurhatGUI, { Furhat } from 'furhat-gui';
//
// function FurhatConnect ({ onMessage }) {
//     const furhatContainerRef = useRef(null);
//
//     useEffect(() => {
//         const furhatGUI = new FurhatGUI({
//             url: 'http://localhost:4000',
//             onConnect: () => console.log('Connected to Furhat GUI'),
//             onDisconnect: () => console.log('Disconnected from Furhat GUI'),
//             onMessage: (message) => {
//                 console.log('Message from Furhat:', message);
//                 if (onMessage) onMessage(message);
//             },
//         });
//
//         // Attach Furhat GUI to the DOM element
//         if (furhatContainerRef.current) {
//             console.log("ATTACHING FURHAT GUI TO THE DOM ELEMENT")
//             furhatGUI.attach(furhatContainerRef.current);
//         }
//
//         return () => {
//             furhatGUI.disconnect();
//         };
//     }, [onMessage]);
//
//     return (
//         <div ref={furhatContainerRef} style={{width: '100%', height: '400px'}}>
//             {/* Furhat GUI will render here */}
//         </div>
//     );
// }
//
// export default FurhatConnect;


import React, { useEffect, useState } from 'react';
import FurhatGUI, { Furhat } from 'furhat-gui';

const FurhatComponent = () => {
    const [furhat, setFurhat] = useState(null);

    console.log("INSIDE FURHAT COMPONENT")
    useEffect(() => {
        console.log("Attempting to connect to Furhat....");
        FurhatGUI()
            .then(connection => {
                console.log("INSIDE CONNECTION WITH FURHAT")
                setFurhat(connection);
                console.log("CONNECTION HAS BEEN ESTABLISHED")
                console.log("Furhat object:", furhat);

                connection.onConnectionError((_connection, ev) => {
                    console.error("Error occurred while connecting to Furhat skill");
                });

                connection.onConnectionClose(() => {
                    console.warn("Connection with Furhat skill has been closed");
                });

                connection.subscribe('furhatos.app.studdybuddy.GreetingEvent', (event) => {
                    console.log('received event: ', event.event_name);
                });
            })
            .catch(console.error);

        // Clean up on unmount
        return () => {
            if (furhat) {
                // Assuming `furhat` has a method to disconnect
                // If `furhat-gui` does not provide a disconnect method, this may not be needed
                furhat.disconnect();
            }
        };
    }, [furhat]); // Empty dependency array to run effect only once on mount

    const sendMessageToFurhat = (message) => {
        if (furhat) {
            furhat.send({
                event_name: 'GreetingEvent',
                param1: message
            });
        }
    };

    return (
        <div>
            <button onClick={() => sendMessageToFurhat('Hello, Furhat!')}>Send Message</button>
        </div>
    );
};

export default FurhatComponent;