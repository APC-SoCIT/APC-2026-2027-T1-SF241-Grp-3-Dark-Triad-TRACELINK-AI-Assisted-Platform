import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api";

function InitiateBatchScan() {
    const [file, setFile] = useState(null);
    const [batch, setBatch] = useState(null);
    const [scan, setScan] = useState(null);

    const [uploading, setUploading] = useState(false);
    const [startingScan, setStartingScan] = useState(false);

    const [error, setError] = useState("");

    function handleFileChange(event) {
        const selectedFile = event.target.files[0] ?? null;

        setFile(selectedFile);
        setBatch(null);
        setScan(null);
        setError("");
    }

    async function handleUpload() {
        if (!file) {
            setError("Please select a CSV file.");
            return;
        }

        setUploading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(`${API_URL}/batches`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to upload CSV.");
            }

            setBatch(data);
            setScan(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    }

    async function handleStartScan() {
        if (!batch) {
            return;
        }

        setStartingScan(true);
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/batches/${batch.batchId}/scan`,
                {
                    method: "POST",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to start scan.");
            }

            setScan({
                jobId: data.jobId,
                batchId: data.batchId,
                status: data.status,
                totalUrls: data.totalUrls,
                completedUrls: 0,
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setStartingScan(false);
        }
    }

    useEffect(() => {
        if (!scan?.jobId || scan.status === "COMPLETED") {
            return;
        }

        const interval = setInterval(async () => {
            try {
                const response = await fetch(
                    `${API_URL}/jobs/${scan.jobId}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Failed to retrieve scan progress."
                    );
                }

                setScan((currentScan) => ({
                    ...currentScan,
                    status: data.status,
                    totalUrls: data.totalUrls,
                    completedUrls: data.completedUrls,
                }));
            } catch (err) {
                setError(err.message);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [scan?.jobId, scan?.status]);

    const progress =
        scan && scan.totalUrls > 0
            ? Math.round(
                  (scan.completedUrls / scan.totalUrls) * 100
              )
            : 0;

    return (
        <div className="page">
            <div className="page-header">
                <h1>Initiate Batch Scan</h1>
                <p>
                    Upload a CSV file containing URLs and initiate
                    technical URL validation.
                </p>
            </div>

            <section className="card">
                <h2>1. Upload URL Batch</h2>

                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                />

                {file && (
                    <p>
                        Selected file: <strong>{file.name}</strong>
                    </p>
                )}

                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                >
                    {uploading ? "Uploading..." : "Upload CSV"}
                </button>
            </section>

            {batch && (
                <section className="card">
                    <h2>2. Batch Prepared</h2>

                    <div className="batch-info">
                        <p>
                            <strong>Batch ID:</strong> {batch.batchId}
                        </p>

                        <p>
                            <strong>File:</strong> {batch.fileName}
                        </p>

                        <p>
                            <strong>Total URLs:</strong> {batch.totalUrls}
                        </p>

                        <p>
                            <strong>Duplicates:</strong>{" "}
                            {batch.duplicateCount}
                        </p>
                    </div>

                    <button
                        onClick={handleStartScan}
                        disabled={startingScan || scan !== null}
                    >
                        {startingScan
                            ? "Starting Scan..."
                            : "Start Scan"}
                    </button>
                </section>
            )}

            {scan && (
                <section className="card">
                    <h2>3. Scan Progress</h2>

                    <p>
                        <strong>Job ID:</strong> {scan.jobId}
                    </p>

                    <p>
                        <strong>Status:</strong> {scan.status}
                    </p>

                    <p>
                        <strong>Progress:</strong>{" "}
                        {scan.completedUrls} / {scan.totalUrls}
                    </p>

                    <progress
                        value={scan.completedUrls}
                        max={scan.totalUrls}
                    />

                    <p>{progress}%</p>

                    {scan.status === "COMPLETED" && (
                        <div className="success-message">
                            <h3>Scan Completed</h3>

                            <p>
                                All {scan.totalUrls} URLs have been
                                processed.
                            </p>

                            <p>
                                Scan Job ID: <strong>{scan.jobId}</strong>
                            </p>

                            <p>
                                You can review this scan from the View
                                Results page.
                            </p>
                        </div>
                    )}
                </section>
            )}

            {error && (
                <section className="error-message">
                    <h3>Error</h3>
                    <p>{error}</p>
                </section>
            )}
        </div>
    );
}

export default InitiateBatchScan;