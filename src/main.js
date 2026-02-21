import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { loadSchoolProfile } from "./services/schoolProfile";

// Initialize app
const app = createApp(App).use(router);

// Load school profile data on app start (async, doesn't block app mounting)
loadSchoolProfile()
  .then(() => {
    console.log("School profile loaded successfully in main.js");
  })
  .catch((error) => {
    console.error("Failed to load school profile in main.js:", error);
  });

// Mount app
app.mount("#app");
