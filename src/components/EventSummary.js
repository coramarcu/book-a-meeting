import { useState, useEffect } from "react";
import { createProfileFromUser } from "../services/firestore";

const EventSummary = ({selectedEvent, setSelectedEvent, setEventSummaryIsOpen}) => {
    const [loading, setLoading] = useState(true);
    const [owner, setOwner] = useState();

    useEffect(() => {
        (async () => {
            const ownerProfile = await createProfileFromUser({uid: selectedEvent.extendedProps.owner});
            setOwner(ownerProfile);
            setLoading(false);
        })();

        const handleClick = () => {
            setSelectedEvent(null);
            setEventSummaryIsOpen(false);
        }

        document.addEventListener("mousedown", handleClick);
        return () => {
        document.removeEventListener("mousedown", handleClick);
    };
    }, []);

    return loading ? (
    <p>loading...</p>
     ) : (
    <div style={{backgroundColor: owner.colour}}>
        <h1>{selectedEvent.title}</h1>
        <h2>Created by: {owner.name}</h2>
        <img src={owner.avatar}/>
        <h3>Date: {new Date(selectedEvent.start.slice(0,10)).toDateString()}</h3>
        <h3>Start time: {new Date(selectedEvent.start).toString().slice(15, 24)}</h3>
        <h3>End time: {new Date(selectedEvent.end).toString().slice(15, 24)}</h3>
        
    </div>
     )
}

export default EventSummary