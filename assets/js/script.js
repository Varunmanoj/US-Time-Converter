// Conveert US  to India time 

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

    // Add the time difference in minutes
    switch (timezone) {
        case 'CST':
            totalMinutes += (11 * 60) + 30;
            break;
        case 'EST':
            totalMinutes += (10 * 60) + 30;
            break;
        case 'MST':
            totalMinutes += (12 * 60) + 30;
            break;
        case 'PST':
            totalMinutes += (13 * 60) + 30;
            break;
        default:
            resultDiv.textContent = 'Invalid time zone selection.';
            return;
    }

    // Convert total minutes to 24-hour format
    const istHours = Math.floor(totalMinutes / 60) % 24;
    const istMinutes = totalMinutes % 60;

    // Format result in 12-hour format
    const period = istHours >= 12 ? 'P.M.' : 'A.M.';
    const displayHours = ((istHours % 12) || 12).toString().padStart(2, '0');
    const displayMinutes = istMinutes.toString().padStart(2, '0');

    resultDiv.textContent = `Converted Time in IST: ${displayHours}:${displayMinutes} ${period}`;
});




// Convert India to US time
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

    // Subtract the time difference in minutes
    switch (timezone) {
        case 'CST':
            totalMinutes -= (11 * 60) + 30;
            break;
        case 'EST':
            totalMinutes -= (10 * 60) + 30;
            break;
        case 'MST':
            totalMinutes -= (12 * 60) + 30;
            break;
        case 'PST':
            totalMinutes -= (13 * 60) + 30;
            break;
        default:
            resultDiv.textContent = 'Invalid time zone selection.';
            return;
    }

    // Convert total minutes to 24-hour format
    const usHours = (Math.floor(totalMinutes / 60) + 24) % 24; // Ensure hours wrap around
    const usMinutes = (totalMinutes % 60 + 60) % 60; // Ensure minutes wrap around

    // Format result in 12-hour format
    const period = usHours >= 12 ? 'P.M.' : 'A.M.';
    const displayHours = ((usHours % 12) || 12).toString().padStart(2, '0');
    const displayMinutes = usMinutes.toString().padStart(2, '0');

    resultDiv.textContent = `Converted Time in ${timezone}: ${displayHours}:${displayMinutes} ${period}`;
});
