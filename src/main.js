import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { loadSchoolProfile } from "./services/schoolProfile";

// Load school profile data on app start
loadSchoolProfile();

createApp(App).use(router).mount("#app");
