import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useContext, useEffect, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { authContext } from "../authContext";
import { profileContext } from "../profileContext";
import { addEvent, createProfileFromUser, getEvents, updateEvent } from "../firestore";
import EditEventForm from "./EditEventForm";
import Navbar from "./Navbar";
import { calculateDefaultEndTime } from "../formatting/dateAndTimeFormatting";
import FullCalendarEvent from "./FullCalendarEvent";
import EventSummary from "./EventSummary";

const Home = () => {
  const { currentUser } = useContext(authContext);
  const [profile, setProfile] = useState();
  const [events, setEvents] = useState();
  const [editEventFormIsOpen, setEditEventFormIsOpen] = useState(false);
  const [eventSummaryIsOpen, setEventSummaryIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
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
  
    const newEvent = await addEvent(`${profile.name}'s Meeting`, dateInfo.dateStr, endString, currentUser.uid);
    setSelectedEvent(newEvent);
    setEditEventFormIsOpen(true);
    setEvents(await getEvents(currentUser.uid));
  }

  const handleEventClick = async (eventInfo) => {
    const clickedEvent = events.find(event => event.id === eventInfo.event._def.publicId);
    setSelectedEvent(clickedEvent);

    if(clickedEvent.editable){
      setEditEventFormIsOpen(true);
    } else {
      setEventSummaryIsOpen(true);
    }
  }

  return loading ? <p>Loading...</p> : (
    <div>
      <profileContext.Provider value={{ profile, setProfile }}>
        <Navbar setEvents={setEvents}/>
      </profileContext.Provider>
      
      <h1>Home</h1>
      <button
        onClick={() => {
          setEditEventFormIsOpen(!editEventFormIsOpen);
        }}
      >
        Add event
      </button>

      <button onClick={handle.enter}>Display Mode</button>
      {editEventFormIsOpen ? (
      <EditEventForm 
        selectedDate={selectedDate} 
        events={events}
        setEvents={setEvents} 
        selectedEvent={selectedEvent} 
        setSelectedEvent={setSelectedEvent} 
        setEditEventFormIsOpen={setEditEventFormIsOpen}
        profile={profile}
      />) : <></>}
      {eventSummaryIsOpen ? <EventSummary
        selectedEvent={selectedEvent} 
        setSelectedEvent={setSelectedEvent} 
        setEventSummaryIsOpen={setEventSummaryIsOpen}
      /> : <></>}
      <FullScreen handle={handle}>
      
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        slotEventOverlap="false"
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
      
    </div>
  );
};

export default Home;
