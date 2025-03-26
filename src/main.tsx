import React from "react";
import ReactDOM from "react-dom/client";
import { HeroUIProvider } from "@heroui/system";
import App from "@/app.tsx";

import "@/styles/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<HeroUIProvider>
			<App/>
		</HeroUIProvider>
	</React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
	console.log(message)
})
