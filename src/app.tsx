import { JSX } from "react";

import RichTextEditor from "@/components/editor";

export default function App(): JSX.Element {
	return (
		<div className="flex flex-col min-h-screen w-screen">
			<main>
				<RichTextEditor/>
			</main>
		</div>
	);
}
