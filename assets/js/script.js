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
