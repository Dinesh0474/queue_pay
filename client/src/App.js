import React, { Fragment, useState, useEffect } from 'react';

import {BrowserRouter as Router,Route,Routes} from "react-router-dom"

import './App.css';
import Stripe from "./component/Stripe"
import Login from "./component/Login"
import Register from "./component/Register"

function App() {
   return(
    <Fragment>
      <Router>
        <Routes>
          <Route   exact path='/payment' element= {<Stripe/>}/>
          <Route   exact path='/' element= ""/>
          <Route   exact path='/userlogin' element= ""/>
          <Route   exact path='/userregister' element= ""/>
          <Route   exact path='/shoplogin' element= ""/>
          <Route   exact path='/shopregister' element= ""/>
          <Route   exact path='/' element= ""/>
        </Routes>
      </Router>
    </Fragment>
   )

}

export default App;
