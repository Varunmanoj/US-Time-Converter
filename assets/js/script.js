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
// Get the play button, result paragraph, and voice select dropdown
const playButtonIst = document.getElementById('play-ist-time');
const resultParagraphIst = document.getElementById('result');
const playButtonUs = document.getElementById('play-us-time');
const resultParagraphUs = document.getElementById('result-1');
const voiceSelect = document.getElementById('voice-select');

// Variable to hold available voices
let voices = [];

// Function to populate the voice selection dropdown
function populateVoices() {
    voices = window.speechSynthesis.getVoices(); // Get the list of available voices

    // Clear any existing options in the dropdown
    voiceSelect.innerHTML = '';

    // Add an option to select "Default Voice"
    const defaultOption = document.createElement('option');
    defaultOption.value = 'default';
    defaultOption.innerText = 'Select Voice';
    voiceSelect.appendChild(defaultOption);

    // Populate the dropdown with the available voices
    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = index; // Store the index of the voice
        option.innerText = voice.name; // Set the voice name as the display text
        voiceSelect.appendChild(option);
    });

    // Retrieve and set the stored voice selection (if exists)
    const storedVoiceIndex = localStorage.getItem('selectedVoiceIndex');
    if (storedVoiceIndex !== null && storedVoiceIndex < voices.length) {
        voiceSelect.value = storedVoiceIndex; // Set the stored voice index as selected
    } else {
        // Set the default voice based on the browser's default voice if no stored value
        const defaultVoiceIndex = voices.findIndex(voice => voice.default);
        if (defaultVoiceIndex !== -1) {
            voiceSelect.value = defaultVoiceIndex; // Set the default voice in the dropdown
        }
    }
}

// Function to announce the text inside the paragraph based on the button clicked
function announceResult(button, paragraph) {
    const text = paragraph.innerText.trim(); // Get the text and remove extra spaces

    // Check if the text is empty
    if (!text) {
        alert("No text to announce!");
        return;
    }

    // Get the selected voice from the dropdown
    const selectedVoiceIndex = voiceSelect.value;

    let selectedVoice = voices[selectedVoiceIndex] || voices[0]; // Default to null if no voice selected

    if (!selectedVoice && voiceSelect.value !== 'default') {
        alert("Invalid voice selection.");
        return;
    }

    // Create a new SpeechSynthesisUtterance object with the text
    const speech = new SpeechSynthesisUtterance(text);

    // Set the selected voice if available
    if (selectedVoice) {
        speech.voice = selectedVoice;
    }

    // Optionally set voice properties like pitch and rate
    speech.pitch = 1; // Normal pitch
    speech.rate = 1; // Normal speaking rate

    // Speak the text
    window.speechSynthesis.speak(speech);
}

// Store the selected voice index in localStorage when the user changes the selection
voiceSelect.addEventListener('change', () => {
    const selectedVoiceIndex = voiceSelect.value;
    localStorage.setItem('selectedVoiceIndex', selectedVoiceIndex); // Store the selected voice index
});

// Function to handle the keyboard shortcut
function handleKeyboardShortcut(event, button, paragraph) {
    // Check for 'Ctrl + U' (Windows) or 'Cmd + U' (Mac) key combination for the second button
    if ((event.ctrlKey || event.metaKey) && event.key === 'u') {
        event.preventDefault(); // Prevent default browser behavior for 'Ctrl/Cmd + U'
        announceResult(button, paragraph); // Trigger the announcement for the second button
    }
}

// Make sure the buttons and paragraphs exist and add event listeners
if (playButtonIst && resultParagraphIst && playButtonUs && resultParagraphUs && voiceSelect) {
    // Trigger speech announcement on the first play button click (for IST)
    playButtonIst.addEventListener('click', () => announceResult(playButtonIst, resultParagraphIst));

    // Trigger speech announcement on the second play button click (for US)
    playButtonUs.addEventListener('click', () => announceResult(playButtonUs, resultParagraphUs));

    // Add keyboard shortcut (Ctrl/Cmd + I) for announcing the text for IST
    document.addEventListener('keydown', function (event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
            event.preventDefault(); // Prevent default browser behavior for 'Ctrl/Cmd + I'
            announceResult(playButtonIst, resultParagraphIst); // Trigger the announcement for IST
        }
    });

    // Add keyboard shortcut (Ctrl/Cmd + U) for announcing the text for US
    document.addEventListener('keydown', function (event) {
        handleKeyboardShortcut(event, playButtonUs, resultParagraphUs); // Trigger the announcement for US
    });

    // Populate the voice selection dropdown on page load
    // window.speechSynthesis.onvoiceschanged = populateVoices;

    // Ensure voices are fully loaded before populating the dropdown
    window.speechSynthesis.onvoiceschanged = function () {
        populateVoices(); // Populate voice options once voices are available
    };

} else {
    console.error('One or more elements (buttons, paragraphs, or voice select) were not found.');
}
