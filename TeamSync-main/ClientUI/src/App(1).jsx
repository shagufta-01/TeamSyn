import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import UserAuth from "./pages/UserAuth/UserAuth";
import { Provider } from "react-redux";
import store from "./store";
import Dashboard from "./pages/Dashboard/Dashboard";
import ScrollToTop from "./components/ScrollToTop"
function App() {
  return (
    <Provider store={store}>
      <Router basename="/">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/UserAuth/*" element={<UserAuth />} />
          <Route path="/Dashboard/*" element={<Dashboard />} />
          <Route path="/Dashboard/*" element={<Dashboard />} />

        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
