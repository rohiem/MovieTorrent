import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./components/Navbar";
import Register from "./screens/Register";
import Profile from "./screens/Profile";
import HomeScreen from "./screens/HomeScreen";
import MovieDetail from "./screens/MovieDetail";
import MovieCreate from "./screens/MovieCreate";
import MovieUpdate from "./screens/MovieUpdate";
import ImageUpdate from "./screens/ImageUpdate";
import ProfileCreate from "./screens/ProfileCreate";
import BrowseMovie from "./screens/BrowseMovie";
function App() {
  return (
    <Router>
      <NavBar />
      <br />
      <br />
      <br />
      <br />
      <br />
      <main>
        <Switch>
          <Route path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/profile/create" component={ProfileCreate} />
          <Route path="/create" component={MovieCreate} />
          <Route path="/browse" component={BrowseMovie} />
          <Route exact path="/" component={HomeScreen} />
          <Route path="/movies/:slug" component={MovieDetail} />
          <Route exact path="/moviesedit/:slug" component={MovieUpdate} />
          <Route exact path="/moviesimageedit/:slug" component={ImageUpdate} />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
