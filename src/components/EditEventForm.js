import { useContext, useEffect, useState } from "react";
import {
  generateStartTimeIncrements,
  generateEndTimeIncrements,
  calculateDefaultEndTime,
} from "../formatting/dateAndTimeFormatting";
import { authContext } from "../authContext";
import { addEvent, deleteEvent, getEvents, updateEvent } from "../firestore";

const EditEventForm = ({ setEvents, selectedEvent, setSelectedEvent, setEditEventFormIsOpen }) => {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("New Meeting");

  const defaultDate = selectedEvent
    ? selectedEvent.start.slice(0, 10)
    : new Date().toISOString().slice(0, 10);
  const defaultStartTime = selectedEvent
    ? selectedEvent.start.slice(11, 16)
    : "08:00";
  const defaultEndTime = selectedEvent ? selectedEvent.end.slice(11, 16) : "08:15";
  
  const timeStart = new Date("01/01/2022 " + defaultStartTime);
  const timeEnd = new Date("01/01/2022 " + defaultEndTime);

  const defaultDuration = selectedEvent ? (timeEnd - timeStart) / 60 / 1000 : 15;
 
  const [date, setDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endTime, setEndTime] = useState(defaultEndTime);
  const [durationInMinutes, setDurationInMinutes] = useState(defaultDuration);
  const [startTimeIncrements, setStartTimeIncrements] = useState();
  const [endTimeIncrements, setEndTimeIncrements] = useState();
  const { currentUser } = useContext(authContext);

  useEffect(() => {
    setLoading(true)
    setStartTimeIncrements(generateStartTimeIncrements());
    setEndTimeIncrements(generateEndTimeIncrements(startTime));
  }, [startTime]);

  useEffect(() => {
    if(selectedEvent && endTimeIncrements){
      const selectedEndTime = endTimeIncrements.find((increment, index) => {
        let incrementDuration = 0;
        if(index <= 2) {
          incrementDuration = parseInt(increment.slice(7, 9))
        } else {
          const hoursPattern = /(?<=\()\d+.*\d*(?=\s)/;
          incrementDuration = parseFloat(increment.match(hoursPattern)[0]) * 60;
        }

        return incrementDuration === durationInMinutes;
      });

      if(selectedEndTime) {
        setEndTime(selectedEndTime);
      } else {
        console.log(endTimeIncrements[endTimeIncrements.length - 1])
        setEndTime(endTimeIncrements[endTimeIncrements.length - 1])
      }
      
      setLoading(false);
    }

  }, [endTimeIncrements]);

  const submitEvent = async (event) => {
    event.preventDefault();

    const owner = currentUser.uid;

    if(selectedEvent){
      updateEvent(
        title,
      date + "T" + startTime + "Z",
      date + "T" + endTime.slice(0, 5) + "Z",
      owner,
      selectedEvent.id
      )
    } else {
      await addEvent(
        title,
        date + "T" + startTime + "Z",
        date + "T" + endTime.slice(0, 5) + "Z",
        owner
      );
    }
    
    const events = await getEvents(currentUser.uid);
    setEvents(events);

    setSelectedEvent(null);
    setEditEventFormIsOpen(false);
  };

  const handleDelete = async () => {
    await deleteEvent(selectedEvent.id);

    const events = await getEvents(currentUser.uid);
    setEvents(events);

    setSelectedEvent(null);
    setEditEventFormIsOpen(false);
  }

  const handleCancel = () => {
    setSelectedEvent(null);
    setEditEventFormIsOpen(false);
  }

  return loading ? (
    <p>Loading...</p>
  ) : (
    <div>
      <h2>Create New Event</h2>
      <form>
        <label>
          Event Title:
          <input
            type="text"
            name="title"
            defaultValue={"New Meeting"}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </label>

        <label>
          Date:
          <input
            type="date"
            name="date"
            defaultValue={date}
            onChange={(event) => {
              setDate(event.target.value);
            }}
          />
        </label>

        <label>
          Start Time:
          <select
            defaultValue={startTime}
            onChange={(event) => {
              setStartTime(event.target.value);
            }}
          >
            {startTimeIncrements.map((increment, index) => {
              return <option key={index}>{increment}</option>;
            })}
          </select>
        </label>

        <label>
          End Time:
          <select
            defaultValue={endTime}
            onChange={(event) => {
              const hoursPattern = /(?<=\()\d+.*\d*(?=\s)/;
              const newDuration = parseFloat(endTime.match(hoursPattern)[0]) * 60;
    
              setDurationInMinutes(newDuration)
              setEndTime(event.target.value);
            }}
          >
            {endTimeIncrements.map((increment, index) => {
              return <option key={index}>{increment}</option>;
            })}
          </select>
        </label>

        <button
          type="submit"
          name="event-submit"
          id="event-submit"
          onClick={submitEvent}
        >
          Confirm
        </button>
      </form>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default EditEventForm;
