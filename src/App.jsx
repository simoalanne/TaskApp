// React hooks
import { useState, useEffect } from "react";

//  React router and pages
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Tasks from "./Tasks";
import Statistics from "./Statistics";
import About from "./About";
import Settings from "./Settings";

// MUI-Icons
import TaskIcon from "@mui/icons-material/Task";
import BarChartIcon from "@mui/icons-material/BarChart";
import InfoIcon from "@mui/icons-material/Info";
import SettingsIcon from "@mui/icons-material/Settings";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// util module for fetching data
import { fetchData, editData } from "./util/api";

// CSS-file
import "./App.css";

/**
 * The main component for the application.
 * This component fetches data from the server and passes it down to the child components.
 * It also contains the navigation and routing for the application.
 *
 * @returns {JSX.Element} - A JSX element containing the application.
 */
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [theme, setTheme] = useState("default");
  const [alternativeMode, setAlternativeMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);

  /**
   * Fetches data from the given URL and updates the given setState function with the fetched data.
   *
   * @param {string} url - The URL to fetch data from.
   * @param {Function} setFunction - The function to set the fetched data.
   * @returns {Promise<void>} - A promise that resolves when the data has been fetched and set.
   * @throws {Error} - Throws an error if the fetch operation fails.
   */
  const fetchAndSet = async (url, setFunction) => {
    try {
      const data = await fetchData(url);
      setFunction((prevData) => [...prevData, ...data]);
    } catch (err) {
      console.error(`Failed to fetch from ${url}:`, err);
    }
  };

  const fetchOptions = async () => {
    try {
      const data = await fetchData("/options");
      setTheme(data[0].theme === "default" ? "light" : data[0].theme);
      setAlternativeMode(data[0].alternative);
    } catch (err) {
      console.error("Failed to fetch options:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchAndSet("/tasks", setTasks),
        fetchAndSet("/tags", setTags),
        fetchAndSet("/timestamps", setTimestamps),
        fetchOptions(),
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const currentTheme = createTheme({
    palette: {
      mode: theme === "light" ? "light" : "dark",
    },
  });

  if (loading) {
    return null;
  }

  const setAndSaveTheme = (theme) => {
    setTheme(theme);
    editData("/options/1", { theme, alternative: alternativeMode });
  };

  const setAndSaveAlternativeMode = (alternative) => {
    setAlternativeMode(alternative);
    editData("/options/1", { theme, alternative });
  };

  const rightMargin = { marginRight: "8px" };
  return (
    <ThemeProvider theme={currentTheme}>
      <BrowserRouter>
        <div className={theme === "light" ? "appLight" : "appDark"}>
          <nav>
            <ul>
              <li>
                <NavLink to="/" className="navLink">
                  <TaskIcon sx={rightMargin} /> Tehtävät
                </NavLink>
              </li>
              <li>
                <NavLink to="/tilastot" className="navLink">
                  <BarChartIcon sx={rightMargin} /> Tilastot
                </NavLink>
              </li>
              <li>
                <NavLink to="/tietoa" className="navLink">
                  <InfoIcon sx={rightMargin} /> Tietoa
                </NavLink>
              </li>
              <li>
                <a
                  href="#"
                  className="navLink"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default navigation
                    setSettingsDrawerOpen(true); // Open the drawer
                  }}
                >
                  <SettingsIcon sx={rightMargin} /> Asetukset
                </a>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route
              path="/"
              element={
                <Tasks
                  tasks={tasks}
                  tags={tags}
                  stamps={timestamps}
                  setTasks={setTasks}
                  setTags={setTags}
                  setStamps={setTimestamps}
                  alternativeModeActive={alternativeMode === 1}
                />
              }
            />
            <Route
              path="/tilastot"
              element={
                <Statistics tasks={tasks} tags={tags} timestamps={timestamps} />
              }
            />
            <Route path="/tietoa" element={<About />} />
          </Routes>

          {/* Settings Drawer */}
          <Settings
            theme={theme}
            setTheme={setAndSaveTheme}
            open={settingsDrawerOpen}
            setOpen={setSettingsDrawerOpen}
            alternative={alternativeMode}
            setAlternative={setAndSaveAlternativeMode}
          />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
