import React from 'react';
import {HashRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import CreateTrackerPage from "@/app/CreateTrackerPage";
import DashboardPage from "@/app/dashboard/Dashboard";
import ExportPage from "@/app/export/ExportPage";
import TrackerPage from "@/app/tracker/TrackerPage";
import ImportPage from "@/app/import/ImportPage";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<CreateTrackerPage />}/>
                <Route path="/dashboard" element={<DashboardPage />}/>
                <Route path="/import" element={<ImportPage />}/>
                <Route path="/export" element={<ExportPage />}/>
                <Route path="/tracker/:trackerId" element={<TrackerPage/>}/>

                <Route path={"*"} element={<Navigate to={"/"} replace/>} />
            </Routes>
        </Router>
    );
}

export default App;