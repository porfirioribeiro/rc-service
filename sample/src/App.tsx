import React, { Component } from 'react';
import { Router, Link } from '@reach/router';
import TodoList from './todos/TodoList';
import Todo from './todos/Todo';
import ServiceTester from './ServiceTester';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
        </header>
        <React.Fragment>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/tests">Tests</Link>
          </nav>
          <React.Suspense fallback={<div>Loading........</div>}>
            <Router>
              <ServiceTester path="/tests" />
              <TodoList path="/" />
              <Todo path="/:id" />
            </Router>
          </React.Suspense>
        </React.Fragment>
      </div>
    );
  }
}

export default App;
