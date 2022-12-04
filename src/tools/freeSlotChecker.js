const freeSlotChecker = (desiredStart, desiredEnd, schedule, id) => {
    for(const scheduledMeeting of schedule){
        if(scheduledMeeting.id === id) {
            continue;
        }

        if(desiredStart >= scheduledMeeting.start && desiredStart <= scheduledMeeting.end){
            return false;
        }

        if(desiredEnd > scheduledMeeting.start && desiredEnd <= scheduledMeeting.end){
            return false;
        }
    }

    return true
}

export default freeSlotChecker;