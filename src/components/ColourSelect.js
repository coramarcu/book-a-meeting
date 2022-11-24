import { useEffect, useState } from "react";
import "./ColourSelect.css"

const ColourSelect = ({colour, setColour}) => {
    const colourOptions = [
        "FireBrick",
        "IndianRed",
        "Coral",
        "orange",
        "DarkSeaGreen",
        "aquamarine",
        "teal",
        "CornflowerBlue",
        "DarkBlue",
        "BlueViolet",
        "purple",
        "plum",
        "pink",   
    ];

    const [selection, setSelection] = useState(colour ? colour : colourOptions[0]);

    useEffect(() => {
        setColour(selection)
    }, [selection])

    return <div>
            <ul>
        {colourOptions.map((colourOption, index) => {
            return <div className={`colour-spot ${colour === colourOption? `selected` : ``}`} key={index} style={{backgroundColor: colourOption}} onClick={() => setSelection(colourOption)}/>
        })}
    </ul>
        </div>
}

export default ColourSelect;