let timerInterval;
let seconds = 0;

export function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        document.getElementById('time').textContent = seconds;
    }, 1000);
}

export function stopTimer() {
    clearInterval(timerInterval);
}

export function resetTimer() {
    stopTimer();
    seconds = 0;
    document.getElementById('time').textContent = '0';
}