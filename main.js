document.addEventListener('DOMContentLoaded', () => {
    let buttons = document.querySelector('.buttons');
    let btn = document.querySelectorAll('span');
    let value = document.getElementById('value');
    let toggleBtn = document.querySelector('.toggleBtn');
    let body = document.querySelector('body');
    let icon = toggleBtn.querySelector('i');

    // Create a new AudioContext
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Function to play a sound
    function playSound(frequency, duration) {
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    }

    // Function to handle button clicks and keyboard input
    function handleButtonClick(content) {
        playSound(440, 0.1);

        if (content === "=") {
            try {
                const expression = value.innerHTML;

                // Basic validation
                if (/[^0-9+\-*/().]/.test(expression)) {
                    throw new Error('Invalid character');
                }

                // Evaluate using math.js
                const result = math.evaluate(expression);

                // Limit result to 12 digits
                let formattedResult = result.toString();
                if (formattedResult.length > 12) {
                    formattedResult = parseFloat(result).toPrecision(12);
                }

                if (Number.isFinite(result)) {
                    value.innerHTML = formattedResult;
                } else {
                    throw new Error('Non-finite result');
                }
            } catch (e) {
                console.error('Error evaluating expression:', e.message);
                value.innerHTML = "Error";
                playSound(200, 0.3);
            }
        } else {
            if (content === "Clear") {
                value.innerHTML = "";
            } else {
                value.innerHTML += content;
            }
        }
    }

    // Add click event listeners to buttons
    for (let i = 0; i < btn.length; i++) {
        btn[i].addEventListener('click', function() {
            handleButtonClick(this.innerHTML.trim());
        });
    }

    // Add keyboard support
    document.addEventListener('keydown', function(event) {
        const key = event.key;

        if (/^\d$/.test(key) || ['+', '-', '*', '/'].includes(key)) {
            handleButtonClick(key);
        } else if (key === 'Enter') {
            handleButtonClick("=");
        } else if (key === 'Escape') {
            handleButtonClick("Clear");
        }
    });

    // Set initial state based on the presence of the 'dark' class
    if (body.classList.contains('dark')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }

    toggleBtn.onclick = function() {
        body.classList.toggle('dark');
        if (body.classList.contains('dark')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
});
