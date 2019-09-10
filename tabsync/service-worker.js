// The install handler takes care of pre-caching the resources we always need.
self.addEventListener('install', function (event) {
    // The promise that skipWaiting() returns can be safely ignored.
    self.skipWaiting();
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
    console.log("Activate event");
});

self.addEventListener('message', function (event) {
    // Receive data from client
    var data = event.data;

    // The unique ID of the tab
    var clientId = event.source.id;

    // A function that handles the message
    self.syncTabState(data, clientId);
});

self.sendTabState = function (client, data) {
    // Post data to a specific client
    client.postMessage(data);
}

self.syncTabState = function (data, clientId) {
    clients.matchAll().then(function (clients) {
        clients.forEach(function (client) {
            // No need to update the client that sent the data
            if (client.id !== clientId) {
                this.console.log('Receiver Client');
                self.sendTabState(client, data);
            }
        });
    });
}
