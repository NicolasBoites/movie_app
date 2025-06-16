import ReactDOM from 'react-dom/client'
import App from './App'
import { Theme } from '@radix-ui/themes'
import "@radix-ui/themes/styles.css";
import './index.css'
 
ReactDOM.createRoot(document.getElementById('root')!).render(
	<Theme>
    <App /> 
	</Theme>
)
