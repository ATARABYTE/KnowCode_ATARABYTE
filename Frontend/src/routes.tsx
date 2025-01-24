import { BrowserRouter, Route, Routes as Switch } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Sidebar_layout from "./components/myComponents/sidebar_layout";
import LiveConsole from "./pages/LiveConsole";
import Records from "./pages/Records";
import AddRecords from "./pages/AddRecords";


export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/"
          element={<Sidebar_layout><Dashboard /></Sidebar_layout>}
        />
        <Route
          path="/Console"
          element={<Sidebar_layout><LiveConsole /></Sidebar_layout>}
        />
        <Route
          path="/Records"
          element={<Sidebar_layout><Records /></Sidebar_layout>}
        />
        <Route
          path="/Records/AddNew"
          element={<Sidebar_layout><AddRecords /></Sidebar_layout>}
        />
      </Switch>
    </BrowserRouter>
  )
}
