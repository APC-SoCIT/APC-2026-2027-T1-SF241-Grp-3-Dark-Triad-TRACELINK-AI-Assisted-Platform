function Sidebar({ activePage, setActivePage }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h1>TraceLink</h1>
                <p>SEO URL Validation</p>
            </div>

            <nav className="sidebar-nav">
                <button
                    className={
                        activePage === "scan"
                            ? "nav-button active"
                            : "nav-button"
                    }
                    onClick={() => setActivePage("scan")}
                >
                    Initiate Batch Scan
                </button>

                <button
                    className={
                        activePage === "results"
                            ? "nav-button active"
                            : "nav-button"
                    }
                    onClick={() => setActivePage("results")}
                >
                    View Results
                </button>
            </nav>
        </aside>
    );
}

export default Sidebar;