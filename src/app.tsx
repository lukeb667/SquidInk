import { useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/electron-vite.animate.svg"

export default function App() {
	const [count, setCount] = useState(0)

	return (
		<>
			<div className="flex justify-center items-center">
				<a href="https://electron-vite.github.io" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>

			<h1>Vite + React</h1>

			<div className="card flex flex-col justify-center items-center gap-y-2">
				<button className="w-1/2" onClick={ () => setCount((count) => count + 1) }>
					count is {count}
				</button>

				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>

			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	)
}
