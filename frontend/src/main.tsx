import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App'
import { Theme } from '@radix-ui/themes'
import "@radix-ui/themes/styles.css";
import "./index.css";

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Theme>
			<App />
		</Theme>
	</StrictMode>
)
