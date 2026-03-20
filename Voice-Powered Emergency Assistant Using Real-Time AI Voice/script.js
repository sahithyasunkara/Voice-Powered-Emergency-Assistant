function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    const status = document.getElementById("status");
    const output = document.getElementById("output");

    status.innerText = "Listening... 🎤";

    recognition.start();

    recognition.onresult = function(event) {
        const text = event.results[0][0].transcript;
        output.innerText = "You said: " + text;

        processCommand(text.toLowerCase());
    };

    recognition.onerror = function() {
        status.innerText = "Error occurred. Try again.";
    };
}


// 🔥 MAIN LOGIC
function processCommand(text) {

    if (text.includes("help")) {
        getLocation();
        respond("Emergency detected. Sending your location.");
    }

    else if (text.includes("ambulance")) {
        getLocation();
        respond("Ambulance is being contacted. Stay calm.");
    }

    else if (text.includes("fire")) {
        respond("Fire emergency detected. Move to a safe place immediately.");
    }

    else if (text.includes("accident")) {
        getLocation();
        respond("Accident detected. Help is on the way.");
    }

    /* else {
        respond("Sorry, I did not understand. Please repeat.");
    } */
}


// 🔊 RESPONSE FUNCTION
function respond(message) {
    document.getElementById("status").innerText = message;

    // OPTION 1: Browser voice (works instantly)
    const speech = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(speech);

    // OPTION 2: Murf AI (uncomment after adding API key)
    // murfSpeak(message);
}


// 📍 LOCATION FUNCTION
function getLocation() {
    const locationDiv = document.getElementById("location");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            locationDiv.innerHTML = `
                📍 Location:<br>
                Latitude: ${lat} <br>
                Longitude: ${lon}
            `;

        });
    } else {
        locationDiv.innerText = "Geolocation not supported.";
    }
}


// 🤖 MURF AI INTEGRATION
async function murfSpeak(text) {
    try {
        const response = await fetch("https://api.murf.ai/v1/speech/generate", {
            method: "POST",
            headers: {
                "Authorization": "Bearer YOUR_API_KEY",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                voice: "en-US-natalie"
            })
        });

        const data = await response.json();
        const audio = new Audio(data.audioFile);
        audio.play();

    } catch (error) {
        console.error("Murf API error:", error);
    } 
}