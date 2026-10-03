import { useState } from "react";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

import Overview from "./pages/Overview";
import ScanResults from "./pages/ScanResults";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import ManualReview from "./pages/ManualReview";
import Workspace from "./pages/Workspace";
import SupportQueue from "./pages/SupportQueue";
import NewScan from "./pages/NewScan";

import {
  createBatch,
  startBatchScan,
} from "./services/api";

import "./App.css";

const roleViews = {
  "SEO Specialist": [
    "Overview",
    "New Scan",
    "Scan Results",
    "Reports",
    "Analytics",
  ],

  "Content Reviewer": [
    "Overview",
    "Manual Review",
    "Reports",
  ],

  "Marketing Manager": [
    "Overview",
    "Reports",
    "Analytics",
  ],

  "System Administrator": [
    "Overview",
    "Workspace",
    "Reports",
  ],

  "Support / Operations": [
    "Overview",
    "Support Queue",
    "Reports",
  ],
};

function App() {
  const [role, setRole] = useState("SEO Specialist");
  const [activePage, setActivePage] = useState("Overview");

  const [currentBatchId, setCurrentBatchId] = useState(null);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  async function handleStartScan(file) {
    setIsScanning(true);

    try {
      const batch = await createBatch(file);

      console.log("Batch created:", batch);

      setCurrentBatchId(batch.batchId);

      const scan = await startBatchScan(batch.batchId);

      console.log("Scan started:", scan);

      setCurrentJobId(scan.jobId);

      setActivePage("Scan Results");
    } finally {
      setIsScanning(false);
    }
  }

  function handleRoleChange(newRole) {
    setRole(newRole);

    const availablePages = roleViews[newRole];

    if (!availablePages.includes(activePage)) {
      setActivePage(availablePages[0]);
    }
  }

  function renderPage() {
    switch (activePage) {
      case "Overview":
        return <Overview />;

      case "New Scan":
        return (
          <NewScan 
            onStartScan={handleStartScan}
            isScanning={isScanning}
          />
        );

      case "Scan Results":
        return <ScanResults 
          jobId={currentJobId}
          onJobChange={setCurrentJobId}
         />;

      case "Reports":
        return <Reports />;

      case "Analytics":
        return <Analytics />;

      case "Manual Review":
        return <ManualReview />;

      case "Workspace":
        return <Workspace />;

      case "Support Queue":
        return <SupportQueue />;

      default:
        return <Overview />;
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        role={role}
        activePage={activePage}
        onPageChange={setActivePage}
      />

      <main className="main-area">
        <TopBar
          activePage={activePage}
          role={role}
          onRoleChange={handleRoleChange}
        />

        {renderPage()}
      </main>
    </div>
  );
}

export default App;