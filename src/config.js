// For development, change this if needed
const DEV_BASE_URL = "http://10.188.1.37:8000"; // your current WiFi IP + Django port
// const DEV_BASE_URL = "http://10.0.2.2:8000"; // use this if testing on Android Emulator

// Later you can add a production server URL here
const PROD_BASE_URL = "https://your-deployed-backend.com";

export const API_BASE_URL =
  process.env.NODE_ENV === "development" ? DEV_BASE_URL : PROD_BASE_URL;
