import { BrowserRouter, Routes, Route } from "react-router-dom";

import ReportForm from "./reports/Create";
import { ReportList } from "./reports/List";
const basepath = 'reports'
export default function Reports() {
    return (
            <Routes>
                <Route path="/" element={<ReportList/>} />
                <Route path={basepath + "/create"} element={<ReportForm/>} />
            </Routes>
    )
}