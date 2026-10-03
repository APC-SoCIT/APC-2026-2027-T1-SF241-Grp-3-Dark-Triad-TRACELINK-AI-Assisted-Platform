import { useRef, useState } from "react";

import {
  CheckCircle2,
  CloudUpload,
  FileText,
  Play,
  X,
} from "lucide-react";

function NewScan({ onStartScan, isScanning = false }) {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setSelectedFile(null);
      setError("Please select a CSV file.");
      return;
    }

    setSelectedFile(file);
    setError("");
  }

  function handleRemoveFile() {
    setSelectedFile(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleStartScan() {
    if (!selectedFile) {
      setError("Select a CSV file before starting a scan.");
      return;
    }

    setError("");

    try {
      await onStartScan(selectedFile);
    } catch (err) {
      setError(err.message || "Failed to start scan.");
    }
  }

  return (
    <div className="content-wrap">
      <section className="page-heading">
        <div>
          <span className="section-kicker">
            URL VALIDATION
          </span>

          <h1>New Scan</h1>

          <p>
            Upload a CSV file containing URLs to initiate a batch scan.
          </p>
        </div>
      </section>

      <section className="upload-card">
        <div className="upload-card-header">
          <div>
            <h3>Upload URL Batch</h3>

            <p>
              Upload a CSV file containing the URLs you want TraceLink to
              validate.
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          hidden
        />

        {!selectedFile ? (
          <div className="upload-dropzone">
            <div className="upload-dropzone-icon">
              <CloudUpload size={26} />
            </div>

            <div className="upload-dropzone-content">
              <strong>Upload URL batch</strong>

              <p>
                Select a CSV file containing the URLs you want to scan.
              </p>
            </div>

            <button
              type="button"
              className="button button-secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
            >
              <FileText size={16} />
              Choose CSV
            </button>
          </div>
        ) : (
          <div className="selected-file">
            <div className="selected-file-info">
              <FileText size={22} />

              <div>
                <strong>{selectedFile.name}</strong>

                <p>
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>

            <button
              type="button"
              className="icon-button"
              onClick={handleRemoveFile}
              aria-label="Remove selected file"
              disabled={isScanning}
            >
              <X size={18} />
            </button>
          </div>
        )}

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        {selectedFile && (
          <div className="upload-ready">
            <CheckCircle2 size={18} />
            <span>CSV ready for batch processing</span>
          </div>
        )}

        <div className="upload-actions">
          <button
            type="button"
            className="button button-primary"
            onClick={handleStartScan}
            disabled={!selectedFile || isScanning}
          >
            <Play size={17} />

            {isScanning ? "Starting Scan..." : "Start Scan"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default NewScan;