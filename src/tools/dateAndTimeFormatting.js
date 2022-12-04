
export const generateStartTimeIncrements = () => {
    const timeIncrements = [];
    let hours = 8;  //adjust earliest start time here
    let minutes = 0;

    for(let i = 0; i < 48; i++){
        let currentIncrement = "";

        if(hours < 10){
            currentIncrement += "0";
        }

        currentIncrement+= hours + ":";

        if(minutes === 0){
            currentIncrement += "0";
        }

        currentIncrement+=minutes;

        timeIncrements.push(currentIncrement);

        minutes += 15;
        if(minutes === 60){
            minutes = 0;
            hours++;
            if(hours >= 24) hours = 0;
        }
    }

    return timeIncrements
}

export const generateEndTimeIncrements = (startTime) => {
    const timeIncrements = [];
    let hours = parseInt(startTime.slice(0,2));
    let minutes = parseInt(startTime.slice(3,5));
    let duration = 15;

    minutes += 15;
    if(minutes === 60){
        minutes = 0;
        hours++;
        if(hours >= 24) hours = 0;
    }

    while(hours < 24){
        //adjust latest end time here
        if(hours === 20){
            if(minutes <= 15){
                let finalIncrement = "20:00 (";
                if(duration < 60){
                    finalIncrement += duration + "mins)";
                } else {
                    finalIncrement += (duration-minutes)/60 + " hrs)";
                } 
                timeIncrements.push(finalIncrement); 
            }
            break;
        }

        let currentIncrement = "";

        if(hours < 10){
            currentIncrement += "0";
        }

        currentIncrement+= hours + ":";

        if(minutes === 0){
            currentIncrement += "0";
        }

        currentIncrement+=minutes + " (";

        if(duration < 60){
            currentIncrement += duration + " mins)";
        } else if(duration === 60){
            currentIncrement += "1 hr)";
        } else {
            currentIncrement += duration/60 + " hrs)";
        }

        timeIncrements.push(currentIncrement);        

        if(duration < 60) {
            duration += 15;
            minutes += 15;
            if(minutes === 60){
            minutes = 0;
            hours++;
            if(hours >= 24) hours = 0;
            }
        } else {
            duration += 30;
            minutes += 30;
            if(minutes >= 60){
                minutes = minutes%60;
                hours++;
                if(hours >= 24) hours = 0;
            }
        }
    }

    return timeIncrements;
}

export const calculateDefaultEndTime = (startTime) => {
    let hours = parseInt(startTime.slice(0,2));
    let minutes = parseInt(startTime.slice(3,5));
    let endTime = "";

    minutes += 15;

    if(minutes === 60){
        minutes = 0;
        hours++;
    }

    if(hours < 10){
        endTime += "0";
    }

    endTime+= hours + ":";

    if(minutes === 0){
        endTime += "0";
    }

    endTime+=minutes;

    return endTime;
}