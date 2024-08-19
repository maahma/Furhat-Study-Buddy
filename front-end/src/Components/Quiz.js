import { useState, useEffect } from 'react'
import axios from 'axios'
import Notes from './Notes';
import React from "react";
import { useFurhat } from '../Context/FurhatContext';


const Quiz = () => {
    const { furhat, furhatConnected } = useFurhat();

    useEffect(() => {
        if (furhatConnected && furhat) {
            furhat.send({
                event_name: 'QuizMe'
            });
            console.log("QuizMe event sent successfully")
        }
    }, [furhat, furhatConnected])

    return (
        <Notes />
    )
}

export default Quiz