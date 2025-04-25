import { HeroUIProvider } from "@heroui/system";
import React from "react";
import ReactDOM from "react-dom/client";


import RichTextEditor from "@/components/editor";

import "@/styles/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
	  <HeroUIProvider>
			<div className="flex flex-col align-items-center justify-center">
			  <RichTextEditor />
			</div>
	  </HeroUIProvider>
	</React.StrictMode>
  );
  
// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
	console.log(message)
});
