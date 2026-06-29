import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { store } from "./redux/store";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="727007070566-ad2kggvv89697n9r4cib0s5q4ucdv0ue.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </Provider>
);