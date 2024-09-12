const updateTimes = function () {
    const locations = document.querySelectorAll("section.times div");
    locations.forEach(location => {
        const timeOutput = location.querySelector("output.time");
        const dateOutput = location.querySelector("output.date");
        const dayOutput = location.querySelector("output.day");
        const timezone = location.getAttribute("data-timezone");

        const now = luxon.DateTime.now().setZone(timezone);

        // Update time
        if (timeOutput) {
            timeOutput.innerHTML = now.toFormat("HH:mm:ss");
        }

        // Update date
        if (dateOutput) {
            dateOutput.innerHTML = now.toFormat("dd.MM.yyyy"); // Format as Year-Month-Day
        }

        // Update day
        if (dayOutput) {
            dayOutput.innerHTML = now.toFormat("cccc"); // Full day name (e.g., Monday)
        }
    });
};

// Initial call to display the times immediately
updateTimes();

// Update the time, date, and day every second
setInterval(updateTimes, 1000);