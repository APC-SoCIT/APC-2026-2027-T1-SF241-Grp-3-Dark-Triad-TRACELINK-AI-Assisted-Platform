const API_BASE_URL = "http://localhost:3000/api";

export async function createBatch(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/batches`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to upload URL batch.");
  }

  return data;
}

export async function startBatchScan(batchId) {
  const response = await fetch(
    `${API_BASE_URL}/batches/${batchId}/scan`,
    {
      method: "POST",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to start batch scan.");
  }

  return data;
}

export async function getJobProgress(jobId) {
  const response = await fetch(
    `${API_BASE_URL}/jobs/${jobId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to retrieve scan progress.");
  }

  return data;
}

export async function getJobResults(jobId) {
  const response = await fetch(
    `${API_BASE_URL}/jobs/${jobId}/results`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to retrieve scan results.");
  }

  return data;
}