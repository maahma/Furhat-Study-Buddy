import FurhatCore from 'furhat-core';

const address = 'localhost'; // or '127.0.0.1'
const portNumber = 54321; 
// let address;
// let portNumber;
let callbackFun;

const API_BASE_URL = `http://${address}:${portNumber}`;

const InitCallback = (status, hat) => {
    if (status === 'open') {
        hat.send({
        event_name: 'furhatos.event.senses.SenseSkillGUIConnected',
        port: portNumber,
        });
        callbackFun(hat);
    } else if (status === 'closed' || status === 'failed') {
        console.log('Trying to reestablish connection to Furhat');
        hat.init(address, portNumber, 'api', InitCallback);
    }
};

// const FurhatGUI = (callback) => {
//     if (callback !== undefined && typeof callback === 'function') {
//       return window.fetch('/port', { method: 'GET' }).then(r =>
//         r.json().then((o) => {
//           const furhat = new FurhatCore();
//           address = o.address;
//           portNumber = o.port;
//           callbackFun = callback;
//           console.log("Furhat address and portNumber are: ", address, " ", portNumber)
//           furhat.init(o.address, o.port, 'api', InitCallback);
//         })
//       );
//     }
//     return new Error('Callback needs to be a function');
// };

const FurhatGUI = (callback) => {
    if (callback !== undefined && typeof callback === 'function') {
        const furhat = new FurhatCore();
        console.log("Furhat address and portNumber are:", address, portNumber);
        furhat.init(address, portNumber, 'api', InitCallback);
        callbackFun = callback;
    } else {
        return new Error('Callback needs to be a function');
    }
};

export default FurhatGUI;