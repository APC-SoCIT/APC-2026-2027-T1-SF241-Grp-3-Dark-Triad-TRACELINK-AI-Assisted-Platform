import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import InitiateBatchScan from "./pages/InitiateBatchScan.jsx";
import ViewResults from "./pages/ViewResults.jsx";

function App() {
    const [activePage, setActivePage] = useState("scan");

    return (
        <div className="app-layout">
            <Sidebar
                activePage={activePage}
                setActivePage={setActivePage}
            />

            <main className="main-content">
                {activePage === "scan" && (
                    <InitiateBatchScan />
                )}

                {activePage === "results" && (
                    <ViewResults />
                )}
            </main>
        </div>
    );
}

export default App;