import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useContext, useEffect, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { authContext } from "../authContext";
import { logOut } from "../firebase";
import { addEvent, createProfileFromUser, deleteEvent, getEvents, updateEvent } from "../firestore";
import NewEventForm from "./NewEventForm";
import Navbar from "./Navbar";
import { calculateDefaultEndTime } from "../formatting/dateAndTimeFormatting";
import FullCalendarEvent from "./FullCalendarEvent";

const Home = () => {
  const { currentUser } = useContext(authContext);
  const [profile, setProfile] = useState();
  const [events, setEvents] = useState();
  const [newEventFormIsOpen, setNewEventFormIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState();
  const [selectedDate, setSelectedDate] = useState();

  const handle = useFullScreenHandle();

  useEffect(() => {
    (async () => {
      const currentProfile = await createProfileFromUser(currentUser);
      setProfile(currentProfile);

        const exampleEvent = 
            {
              title: "Test",
              start: "2022-10-20T12:00Z",
              end: "2022-10-20T16:00Z",
              owner: currentUser.uid,
              allDay: false,
            };
        //await addEvent(exampleEvent.title, exampleEvent.start, exampleEvent.end, exampleEvent.owner);

      setEvents(await getEvents(currentUser.uid));
    })();
  }, [currentUser]);

  const handleEventChange = (changeInfo) => {
    updateEvent(
      changeInfo.event.title,
      changeInfo.event.start.toISOString(),
      changeInfo.event.end.toISOString(),
      currentUser.uid,
      changeInfo.event.id
    );
  };
  
  const handleDateClick = async (dateInfo) => {
    setSelectedDate(dateInfo);

    const endTime = calculateDefaultEndTime(dateInfo.dateStr.slice(11, 16));
    const endString = dateInfo.dateStr.slice(0,10) + 'T' + endTime;
  
    const newEvent = await addEvent('test', dateInfo.dateStr, endString, currentUser.uid);
    setSelectedEvent(newEvent);
    setNewEventFormIsOpen(true);
    setEvents(await getEvents(currentUser.uid));
  }

  const handleEventClick = async (eventInfo) => {
    const clickedEvent = events.find(event => event.id === eventInfo.event._def.publicId);
    if(clickedEvent.editable){
      setSelectedEvent(clickedEvent);
      setNewEventFormIsOpen(true);
    }
  }

  return (
    <div>
      <Navbar></Navbar>
      <h1>Home</h1>
      <button
        onClick={() => {
          setNewEventFormIsOpen(!newEventFormIsOpen);
        }}
      >
        Add event
      </button>

      <button onClick={handle.enter}>Fullscreen</button>
      {newEventFormIsOpen ? (
      <NewEventForm 
        selectedDate={selectedDate} 
        setEvents={setEvents} 
        selectedEvent={selectedEvent} 
        setSelectedEvent={setSelectedEvent} 
        setNewEventFormIsOpen={setNewEventFormIsOpen}
      />) : <></>}
      <FullScreen handle={handle}>
      
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        height={600}
        slotMinTime={"08:00:00"}
        slotMaxTime={"20:00:00"}
        timeZone="Europe/London"
        weekends={false}
        allDaySlot={false}
        slotDuration={"00:15:00"}
        nowIndicator={true}
        scrollTime={new Date().getUTCHours() + ":00"}
        editable={true}
        selectable={true}
        selectOverlap={false}
        events={events}
        eventChange={handleEventChange}
        dateClick={handleDateClick}
        eventContent={FullCalendarEvent}
        eventClick={handleEventClick}
      />
      </FullScreen>
      <button onClick={() => logOut()}>Log out</button>
    </div>
  );
};

export default Home;
