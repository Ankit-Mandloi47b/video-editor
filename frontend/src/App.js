import './App.css';

import SvgToVideo from './CommonComponents/SvgToVideo';
import Editor from './Editor';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Renderer from './Renderer';

function App() {
  return <BrowserRouter>
    <Routes>
      <Route element={<Editor />} path='/' />
      <Route element={<Renderer />} path='/render/:id' />

      <Route element={<No4/>} path='/404' />
      <Route element={<Navigate replace to={'/404'} />} path='*' />
    </Routes>

  </BrowserRouter> 
  // return <SvgToVideo />
}

export default App;

function No4(params) {
  return <h3>404 Page not found</h3>
}