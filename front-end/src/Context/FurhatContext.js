import React, { createContext, useContext, useState, useEffect } from 'react';
import Furhat from 'furhat-core';

const FurhatContext = createContext();

export const FurhatContextProvider = ({ children }) => {
    const [furhat, setFurhat] = useState(null);
    const [furhatConnected, setFurhatConnected] = useState(false);
    const address =  'localhost' //'192.168.131.118' 
    const portNumber = 8080      //1932; 

    useEffect(() => {
        const initializeFurhat = async () => {
            try {
                let furhatInstance = new Furhat(address, portNumber, 'api');
                await furhatInstance.init();
                setFurhat(furhatInstance);
                console.log("FURHAT IS SET IN FURHAT CONTEXT", furhatInstance)
                setFurhatConnected(true);
                // furhatInstance.send({
                //     event_name: 'furhatos.event.senses.SenseSkillGUIConnected',
                // });
            } catch (error) {
                console.error("Failed to connect to Furhat:", error);
            }
        };

        initializeFurhat();
    }, []);

    return (
        <FurhatContext.Provider value={{ furhat, furhatConnected }}>
            {children}
        </FurhatContext.Provider>
    );
};

export const useFurhat = () => useContext(FurhatContext);