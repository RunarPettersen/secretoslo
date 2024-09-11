// Function to update times based on time zones
const updateTimes = function () {
    const locations = document.querySelectorAll("section.times div");
    locations.forEach(location => {
        const output = location.querySelector("output");
        const timezone = location.getAttribute("data-timezone");

        const now = luxon.DateTime.now().setZone(timezone);

        output.innerHTML = now.toFormat("HH:mm:ss");
    });
};

// Initial call to update times
updateTimes();

// Update the times every second
setInterval(updateTimes, 1000);
