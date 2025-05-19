import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const DOMAIN_OPTIONS = [
  "Web Developer",
  "AI/ML Engineer",
  "Software Developer",
  "Data Scientist",
  "Mobile Developer"
];

function App() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [domain, setDomain] = useState("");

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDomainChange = (e) => {
    setDomain(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResults(null);

    const formData = new FormData();
    formData.append("resume", file);
    if (domain) formData.append("domain", domain);

    try {
      const res = await axios.post(
        "https://skill-extraction-tool.onrender.com/extract-skills",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResults(res.data);
    } catch (err) {
      setResults({ error: "Error analyzing resume." });
    }
    setLoading(false);
  };

  return (
    <div className="resume-checker-container">
      <h1>Resume Checker</h1>
      <p className="subtitle">
        Upload your resume below for a <strong>free resume scan</strong>.
      </p>
      <div className="domain-select">
        <select value={domain} onChange={handleDomainChange}>
          <option value="">Select Target Domain (optional)</option>
          {DOMAIN_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div
        className={`dropzone${dragActive ? " active" : ""}`}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById("resume-upload").click()}
      >
        <input
          id="resume-upload"
          type="file"
          accept=".pdf,.txt"
          style={{ display: "none" }}
          onChange={handleChange}
        />
        {file ? (
          <span className="selected-file-name">{file.name}</span>
        ) : (
          <span>Drag & drop your resume here, or click to select file</span>
        )}
      </div>
      <button
        className="upload-btn"
        onClick={handleUpload}
        disabled={!file || loading}
      >
        {loading ? "Analyzing..." : "Scan Resume"}
      </button>
      {loading && <div className="spinner"></div>}
      {results && (
        <div className="results-panel">
          {results.error ? (
            <div className="error">{results.error}</div>
          ) : (
            <>
              <h2>Scan Results</h2>
              {results.name && <div><strong>Name:</strong> {results.name}</div>}
              {results.email && <div><strong>Email:</strong> {results.email}</div>}
              {results.phone && <div><strong>Phone:</strong> {results.phone}</div>}
              {results.linkedin && (
                <div>
                  <strong>LinkedIn:</strong>{" "}
                  <a href={results.linkedin} target="_blank" rel="noopener noreferrer">{results.linkedin}</a>
                </div>
              )}
              {results.github && (
                <div>
                  <strong>GitHub:</strong>{" "}
                  <a href={results.github} target="_blank" rel="noopener noreferrer">{results.github}</a>
                </div>
              )}
              <div>
                <strong>Skills:</strong>{" "}
                {results.skills && results.skills.length > 0
                  ? results.skills.join(", ")
                  : "None found"}
              </div>
              {results.match_percentage !== undefined && (
                <div>
                  <strong>ATS Match:</strong>{" "}
                  {`${results.match_percentage}%`}
                </div>
              )}
              {results.missing_skills && results.missing_skills.length > 0 && (
                <div>
                  <strong>Skills to Learn:</strong> {results.missing_skills.join(", ")}
                </div>
              )}
              {results.categorized_skills && Object.keys(results.categorized_skills).length > 0 && (
                <div>
                  <strong>Skills by Category:</strong>
                  <ul>
                    {Object.entries(results.categorized_skills).map(([cat, skills]) => (
                      <li key={cat}><strong>{cat}:</strong> {skills.join(", ")}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
