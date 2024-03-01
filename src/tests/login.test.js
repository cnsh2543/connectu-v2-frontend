import React from 'react'
import { render, screen, act} from '@testing-library/react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import '@testing-library/jest-dom/extend-expect'
import Login from '../components/login';
import { ProvideAuth } from '../utils/authContext';
// import MockAdapter from 'axios-mock-adapter';

describe('<Login/>', () => {
  it('should render items', () => {
    render(
      <ProvideAuth>
        <Router>
            <Login/>
      </Router>
    </ProvideAuth>
    );
    
    expect(screen.getByText('Username')).toBeVisible()
    expect(screen.getByText('Password')).toBeVisible()
  })
})
