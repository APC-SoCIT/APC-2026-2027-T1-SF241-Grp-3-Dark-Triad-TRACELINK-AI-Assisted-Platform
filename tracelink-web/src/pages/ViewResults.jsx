import { useState } from "react";

const API_URL = "http://localhost:3000/api";

function ViewResults() {
    const [jobId, setJobId] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleViewResults(event) {
        event.preventDefault();

        if (!jobId) {
            setError("Please enter a Scan Job ID.");
            return;
        }

        setLoading(true);
        setError("");
        setResults(null);

        try {
            const response = await fetch(
                `${API_URL}/jobs/${jobId}/results`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to retrieve scan results."
                );
            }

            setResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1>View Results</h1>
                <p>
                    Enter a Scan Job ID to review the persisted
                    technical validation results.
                </p>
            </div>

            <section className="card">
                <h2>Find Scan Results</h2>

                <form onSubmit={handleViewResults}>
                    <label htmlFor="jobId">
                        Scan Job ID
                    </label>

                    <input
                        id="jobId"
                        type="number"
                        min="1"
                        value={jobId}
                        onChange={(event) =>
                            setJobId(event.target.value)
                        }
                        placeholder="Enter Job ID"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Loading..."
                            : "View Results"}
                    </button>
                </form>
            </section>

            {error && (
                <section className="error-message">
                    <h3>Error</h3>
                    <p>{error}</p>
                </section>
            )}

            {results && (
                <>
                    <section className="card">
                        <h2>Scan Summary</h2>

                        <p>
                            <strong>File:</strong>{" "}
                            {results.fileName}
                        </p>

                        <p>
                            <strong>Batch ID:</strong>{" "}
                            {results.batchId}
                        </p>

                        <p>
                            <strong>Job ID:</strong>{" "}
                            {results.jobId}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {results.status}
                        </p>

                        <p>
                            <strong>Total URLs:</strong>{" "}
                            {results.totalUrls}
                        </p>

                        <p>
                            <strong>Started:</strong>{" "}
                            {results.startedAt
                                ? new Date(
                                      results.startedAt
                                  ).toLocaleString()
                                : "—"}
                        </p>

                        <p>
                            <strong>Completed:</strong>{" "}
                            {results.completedAt
                                ? new Date(
                                      results.completedAt
                                  ).toLocaleString()
                                : "—"}
                        </p>
                    </section>

                    <section className="card">
                        <h2>URL Results</h2>

                        {results.results.length === 0 ? (
                            <p>
                                No results are currently available
                                for this scan.
                            </p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Original URL</th>
                                        <th>HTTP</th>
                                        <th>Status</th>
                                        <th>Final URL</th>
                                        <th>Redirects</th>
                                        <th>Duplicate</th>
                                        <th>Error</th>
                                        <th>Checked At</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {results.results.map(
                                        (result) => (
                                            <tr
                                                key={
                                                    result.resultId
                                                }
                                            >
                                                <td>
                                                    {
                                                        result.url
                                                            .original
                                                    }
                                                </td>

                                                <td>
                                                    {result.httpStatus ??
                                                        "—"}
                                                </td>

                                                <td>
                                                    {
                                                        result.statusLabel
                                                    }
                                                </td>

                                                <td>
                                                    {result.finalUrl ??
                                                        "—"}
                                                </td>

                                                <td>
                                                    {
                                                        result.redirectCount
                                                    }
                                                </td>

                                                <td>
                                                    {result.url
                                                        .isDuplicate
                                                        ? "Yes"
                                                        : "No"}
                                                </td>

                                                <td>
                                                    {result.errorType ??
                                                        "—"}
                                                </td>

                                                <td>
                                                    {result.checkedAt
                                                        ? new Date(
                                                              result.checkedAt
                                                          ).toLocaleString()
                                                        : "—"}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}

export default ViewResults;