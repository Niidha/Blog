import { createRoot } from 'react-dom/client'
import './index.css'
import {Toaster} from "react-hot-toast"
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './pages/redux/store.jsx'

createRoot(document.getElementById('root')).render(
 
    <Provider store={store}>
        <App />,
        <Toaster position='top-right'/> 
    </Provider>
)
