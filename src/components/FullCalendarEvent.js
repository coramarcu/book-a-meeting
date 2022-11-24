const FullCalendarEvent = (eventInfo) => {
    return (
        <div>
        <h3>{eventInfo.event.title}</h3>
        <p>{eventInfo.timeText}</p>
        <p>created by: {eventInfo.event.extendedProps.owner}</p>
    </div>
    )
}

export default FullCalendarEvent;