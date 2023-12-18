import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import IndexPage from "./Pages/IndexPage";
import Header from "./Components/Header.js";
import Register from "./Pages/Register.js";
import AccountPage from "./Pages/AccountPage.js";
import PlacePage from "./Pages/PlacePage.js";
import "./App.css"
import axios from "axios";
import { UserContextProvider } from "./UserContext.js";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:4000"
function App() {
  return (
    <UserContextProvider>
      <Router>
      <Header/>
        <Routes>
          <Route path="/" element={<IndexPage/>}></Route>
          <Route path='/login' element={<LoginPage/>}></Route>
          <Route path="/register" element={<Register/>}></Route>
          <Route path="/account/:subpage?" element={<AccountPage/>}></Route>
          <Route path="/account/:subpage/:action?" element={<AccountPage/>}></Route>
          <Route path="/place/:id" element = {<PlacePage></PlacePage>}></Route>
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

export default App;
