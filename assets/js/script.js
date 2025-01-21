// Hide the Play buttons on android and Ios 
function hidePlayIcons() {
    // Detect the platform using the userAgent string
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes("android");
    const isIOS = /iphone|ipad|ipod/.test(userAgent) && 'ontouchend' in document;

    // IDs of the play icons
    const playIcons = ["play-ist-time", "play-us-time","voice-settings-dialog"];

    // If the platform is Android or iOS, hide the icons
    if (isAndroid || isIOS) {
        playIcons.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = "none"; // Hide the element
            }
        });
    }
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", hidePlayIcons);




// Main business logic begins

const isDSTActive = (timeZone) => {
    const now = new Date();
    const isStandardTime = now.toLocaleString('en-US', { timeZone, timeZoneName: 'short' }).endsWith('ST');
    return !isStandardTime;
};

const updateTimeZoneOptions = (dropdownId) => {
    const dropdown = document.getElementById(dropdownId);
    const zones = [
        { std: 'CST', dst: 'CDT', tz: 'America/Chicago' },
        { std: 'EST', dst: 'EDT', tz: 'America/New_York' },
        { std: 'MST', dst: 'MDT', tz: 'America/Denver' },
        { std: 'PST', dst: 'PDT', tz: 'America/Los_Angeles' }
    ];

    dropdown.innerHTML = ''; // Clear existing options.

    zones.forEach(zone => {
        const option = document.createElement('option');
        if (isDSTActive(zone.tz)) {
            option.value = zone.dst;
            option.textContent = `${zone.dst} - ${zone.dst === 'CDT' ? 'Central Daylight Saving Time' :
                zone.dst === 'EDT' ? 'Eastern Daylight Saving Time' :
                    zone.dst === 'MDT' ? 'Mountain Daylight Saving Time' : 'Pacific Daylight Saving Time'}`;
        } else {
            option.value = zone.std;
            option.textContent = `${zone.std} - ${zone.std === 'CST' ? 'Central Standard Time' :
                zone.std === 'EST' ? 'Eastern Standard Time' :
                    zone.std === 'MST' ? 'Mountain Standard Time' : 'Pacific Standard Time'}`;
        }
        dropdown.appendChild(option);
    });
};

const convertUSToIndia = () => {
    document.getElementById('convertButton').addEventListener('click', () => {
        const timeInput = document.getElementById('timeInput').value;
        const timezone = document.getElementById('timezoneSelect').value;
        const resultDiv = document.getElementById('result');

        if (!timeInput) {
            resultDiv.textContent = 'Please enter a valid time.';
            return;
        }

        const [hours, minutes] = timeInput.split(':').map(Number);
        let totalMinutes = hours * 60 + minutes;

        switch (timezone) {
            case 'CST': case 'CDT':
                totalMinutes += isDSTActive('America/Chicago') ? (10 * 60) + 30 : (11 * 60) + 30;
                break;
            case 'EST': case 'EDT':
                totalMinutes += isDSTActive('America/New_York') ? (9 * 60) + 30 : (10 * 60) + 30;
                break;
            case 'MST': case 'MDT':
                totalMinutes += isDSTActive('America/Denver') ? (11 * 60) + 30 : (12 * 60) + 30;
                break;
            case 'PST': case 'PDT':
                totalMinutes += isDSTActive('America/Los_Angeles') ? (12 * 60) + 30 : (13 * 60) + 30;
                break;
            default:
                resultDiv.textContent = 'Invalid time zone selection.';
                return;
        }

        const istHours = Math.floor(totalMinutes / 60) % 24;
        const istMinutes = totalMinutes % 60;
        const period = istHours >= 12 ? 'P.M.' : 'A.M.';
        const displayHours = ((istHours % 12) || 12).toString().padStart(2, '0');
        const displayMinutes = istMinutes.toString().padStart(2, '0');

        resultDiv.textContent = `Converted Time in IST: ${displayHours}:${displayMinutes} ${period}`;
    });
};

const convertIndiaToUS = () => {
    document.getElementById('convertButton-1').addEventListener('click', () => {
        const timeInput = document.getElementById('timeInput-1').value;
        const timezone = document.getElementById('timezoneSelect-1').value;
        const resultDiv = document.getElementById('result-1');

        if (!timeInput) {
            resultDiv.textContent = 'Please enter a valid time.';
            return;
        }

        const [hours, minutes] = timeInput.split(':').map(Number);
        let totalMinutes = hours * 60 + minutes;

        switch (timezone) {
            case 'CST': case 'CDT':
                totalMinutes -= isDSTActive('America/Chicago') ? (10 * 60) + 30 : (11 * 60) + 30;
                break;
            case 'EST': case 'EDT':
                totalMinutes -= isDSTActive('America/New_York') ? (9 * 60) + 30 : (10 * 60) + 30;
                break;
            case 'MST': case 'MDT':
                totalMinutes -= isDSTActive('America/Denver') ? (11 * 60) + 30 : (12 * 60) + 30;
                break;
            case 'PST': case 'PDT':
                totalMinutes -= isDSTActive('America/Los_Angeles') ? (12 * 60) + 30 : (13 * 60) + 30;
                break;
            default:
                resultDiv.textContent = 'Invalid time zone selection.';
                return;
        }

        const usHours = (Math.floor(totalMinutes / 60) + 24) % 24;
        const usMinutes = (totalMinutes % 60 + 60) % 60;
        const period = usHours >= 12 ? 'P.M.' : 'A.M.';
        const displayHours = ((usHours % 12) || 12).toString().padStart(2, '0');
        const displayMinutes = usMinutes.toString().padStart(2, '0');

        resultDiv.textContent = `Converted Time in ${timezone}: ${displayHours}:${displayMinutes} ${period}`;
    });
};

window.onload = () => {
    updateTimeZoneOptions('timezoneSelect');
    updateTimeZoneOptions('timezoneSelect-1');
    convertUSToIndia();
    convertIndiaToUS();
};



// Update Local time 
function updateTime() {
    const timeZones = {
        ist: "Asia/Kolkata",
        cst: "America/Chicago",
        est: "America/New_York",
        mst: "America/Denver",
        pst: "America/Los_Angeles",
    };

    const options = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true };

    // Update each time zone
    document.getElementById("istTime").innerText = new Intl.DateTimeFormat("en-US", { ...options, timeZone: timeZones.ist }).format(new Date());
    document.getElementById("cstTime").innerText = new Intl.DateTimeFormat("en-US", { ...options, timeZone: timeZones.cst }).format(new Date());
    document.getElementById("estTime").innerText = new Intl.DateTimeFormat("en-US", { ...options, timeZone: timeZones.est }).format(new Date());
    document.getElementById("mstTime").innerText = new Intl.DateTimeFormat("en-US", { ...options, timeZone: timeZones.mst }).format(new Date());
    document.getElementById("pstTime").innerText = new Intl.DateTimeFormat("en-US", { ...options, timeZone: timeZones.pst }).format(new Date());
}

// Update time every second
setInterval(updateTime, 1000);

// Initial call to populate table immediately
updateTime();

// Speak the conerted time aloud 
// Initialize voices array
let voices = [];

// Populate voice options dynamically
function populateVoices() {
    voices = speechSynthesis.getVoices();

    if (voices.length === 0) {
        console.error("No voices available in SpeechSynthesis API.");
        return;
    }

    // Sort voices by language and dialect
    voices.sort((a, b) => {
        if (a.lang < b.lang) return -1;
        if (a.lang > b.lang) return 1;
        return 0;
    });

    const voiceSelect = document.getElementById("voice-select");
    voiceSelect.innerHTML = ""; // Clear existing options

    voices.forEach((voice) => {
        const option = document.createElement("option");
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    const selectedVoiceName = localStorage.getItem("selectedVoice");
    if (selectedVoiceName) {
        voiceSelect.value = selectedVoiceName;
    }
});

// Save selected voice to localStorage
function saveSelectedVoice() {
    const voiceSelect = document.getElementById("voice-select");
    localStorage.setItem("selectedVoice", voiceSelect.value);
}

// Speak text using the selected voice
function speakText(paragraphId) {
    const paragraph = document.getElementById(paragraphId);
    if (!paragraph) {
        console.error(`Paragraph with ID '${paragraphId}' not found.`);
        return;
    }

    const text = paragraph.textContent.trim();
    if (!text) {
        console.error("No text to speak.");
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoiceName = localStorage.getItem("selectedVoice");
    const selectedVoice = voices.find((voice) => voice.name === selectedVoiceName);

    utterance.voice = selectedVoice || voices[0]; // Default to first voice if none selected
    speechSynthesis.speak(utterance);
}


// Add event listeners
function addEventListeners() {
    // Play IST time
    const playIstTime = document.getElementById("play-ist-time");
    if (playIstTime) {
        playIstTime.addEventListener("click", () => speakText("result"));
    }
    // Play US time
    const playUsTime = document.getElementById("play-us-time");
    if (playUsTime) {
        playUsTime.addEventListener("click", () => speakText("result-1"));
    }

    // Voice selection change
    const voiceSelect = document.getElementById("voice-select");
    if (voiceSelect) {
        voiceSelect.addEventListener("change", saveSelectedVoice);
    }
}

// Initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    // Populate voices when available
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.addEventListener("voiceschanged", populateVoices);
    }

    populateVoices();
    hidePlayIcons();
    addEventListeners();
})