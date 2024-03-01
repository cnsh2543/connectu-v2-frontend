import './App.css';
import React from "react";
import Login from './components/login.jsx';
import {BrowserRouter as Router,Routes,Route,} from 'react-router-dom'
import { ProvideAuth } from './utils/authContext.js';
import PrivateRoute from './components/privateRoute.jsx'
import SignupForm from './components/signup.jsx';
import Newsfeed from './components/newsfeed.jsx';
import Personal from './components/personal.jsx';

const App = () => {


  return (
    <div className="h-screen">
      <ProvideAuth>
        <Router>
          <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<SignupForm />}/>
            <Route exact path='/newsfeed' element={<PrivateRoute/>}>
              <Route exact path='/newsfeed' element={<Newsfeed/>}/>
            </Route>
            <Route exact path='/personal' element={<PrivateRoute/>}>
              <Route exact path='/personal' element={<Personal/>}/>
            </Route>
          </Routes>
        </Router>
      </ProvideAuth>
    </div>
  );
}

 


export default App;
