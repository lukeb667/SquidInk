import { HeroUIProvider } from "@heroui/system";
import React from "react";
import ReactDOM from "react-dom/client";


import RichTextEditor from "@/components/editor";

import "@/styles/styles.css";
import TaskTracker from "./components/tasks";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
	  <HeroUIProvider>
		<div className="flex flex-col min-h-screen w-screen">
		  <main className="flex flex-row h-full">
			{/* Editor takes up remaining space */}
			<div className="flex-1">
			  <RichTextEditor />
			</div>
			
			{/* Task tracker as a sidebar */}
			<div className="w-80 border-l border-gray-200">
			  <TaskTracker />
			</div>
		  </main>
		</div>
	  </HeroUIProvider>
	</React.StrictMode>
  );
  
// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
	console.log(message)
});
