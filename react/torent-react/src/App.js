import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./components/Navbar";
import Register from "./screens/Register";
import Profile from "./screens/Profile";
function App() {
  return (
    <Router>
      <NavBar />
      <main>
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
