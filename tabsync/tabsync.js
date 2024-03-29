if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
        .then(function () {
            initCounter();
            return navigator.serviceWorker.ready;
        })
        .then(function (reg) {
            console.log('Service Worker is ready', reg);
            // Here we add the event listener for receiving messages
            navigator.serviceWorker.addEventListener('message', function (event) {
                console.log(event.data);
                if (event.data) {
                    var data = event.data;
                    if (data.property === 'counter' && data.state) {
                        setCounter(data.state, true);
                    }
                }
            });
        }).catch(function (error) {
            console.error('Service Worker registration error: ', error);
        });
}

function initCounter() {
    // We use localstorage but easily could use IndexDB!
    var validStoredCounter = localStorage.getItem("counter") !== undefined &&
        localStorage.getItem("counter") !== null &&
        localStorage.getItem("counter") !== "NaN"

    if (validStoredCounter) {
        var count = parseInt(localStorage.getItem("counter"));
        setCounter(count, false);
    } else {
        setCounter(0, false);
    }

    document.getElementById("increment").addEventListener("click", increment);
    document.getElementById("decrement").addEventListener("click", decrement);

}

function decrement(event) {
    var count = getCount() - 1;
    setCounter(count, false)
}

function increment(event) {
    var count = getCount() + 1;
    setCounter(count, false)
}

function getCount() {
    var count = parseInt(document.getElementById("counter").innerHTML);
    if (!isNaN(count)) {
        return count;
    } else {
        return 0;
    }
}

function setCounter(count, fromOtherTab) {
    document.getElementById("counter").innerHTML = parseInt(count);
    if (!fromOtherTab) {
        localStorage.setItem("counter", count);
        stateToServiceWorker({ property: "counter", state: count });
    }
}

function stateToServiceWorker(data) {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(data);
    }
}
