const padStartToTwo = (time) => {
    return `${time}`.padStart(2, `0`);
}

function updateTime() {
    const time = new Date();
    const year = time.getFullYear();
    const month = padStartToTwo(time.getMonth() + 1);
    const date = padStartToTwo(time.getDate());

    const hours = padStartToTwo(time.getHours());
    const minutes = padStartToTwo(time.getMinutes());
    const seconds = padStartToTwo(time.getSeconds());

    document.querySelector('.date').textContent = `${year} - ${month} - ${date}`;
    document.querySelector('.clock').textContent = `${hours}:${minutes}:${seconds}`;
}

updateTime();
setInterval(updateTime, 1000);