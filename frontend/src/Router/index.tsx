import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import DefaultLayout from "../layouts/DefaultLayout";
import { BoardPage } from "../pages/BoardPage";
import ProtectedRoute from "./components/ProtectedRoute";


export function Router(){
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout/>}>
        <Route path="/" element={<Home/>} />
        <Route path="/board" element={<ProtectedRoute>
          <BoardPage/>
        </ProtectedRoute>} />
      </Route>
    </Routes>
  )
}