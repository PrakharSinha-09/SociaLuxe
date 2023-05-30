// import './App.css';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from 'scenes/homePage';
import LoginPage from 'scenes/loginPage';
import ProfilePage from 'scenes/profilePage';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';                              //if you ever want to grab any information from the store, we have useSelector..see line 13, we grabbed the mode of the state, which is currently the light mode.
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';

function App() {
  const mode=useSelector((state)=> state.mode)                          //will give us the mode of the state, which is initally set to lightmode
  const theme=useMemo(()=>createTheme(themeSettings(mode)),[mode])
  const isAuth=Boolean(useSelector((state)=>state.token))               //if token exist, we are authorized
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path='/' element={<LoginPage /> } />
            <Route path='/home' element={isAuth ? <HomePage /> : <Navigate to="/" />} />
            <Route path='/profile/:userId' element={isAuth ? <ProfilePage /> : <Navigate to="/" /> } />
          </Routes>
        </ThemeProvider> 
      </BrowserRouter> 

    </div>
  );
}

export default App;
