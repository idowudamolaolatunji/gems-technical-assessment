import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from 'react-redux';
import { store } from "./stores"
import { Toaster } from "sonner";
import App from "./App.tsx";
import "./styles/variables.css";
import "./styles/auth.css";
import "./styles/globals.css";
import "./styles/main.css";


createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<Toaster />
			<App />
		</Provider>
	</StrictMode>
);