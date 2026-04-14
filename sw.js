self.addEventListener("install", () => {
  console.log("App Installed");
});

self.addEventListener("fetch", function(event) {
  event.respondWith(fetch(event.request));
});