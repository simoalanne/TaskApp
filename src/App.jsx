import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import TaskList from "./TaskList";
import AddTask from "./AddTask";
import About from "./About";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Tehtävät
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/lisaa-tehtava"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Lisää uusi tehtävä
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tietoa"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Tietoa sovelluksesta
              </NavLink>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/lisaa-tehtava" element={<AddTask />} />
          <Route path="/tietoa" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
