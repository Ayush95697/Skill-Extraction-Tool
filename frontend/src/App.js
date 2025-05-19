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
    <div className="app-container">
      <div className="resume-checker-container">
        <div className="app-header">
          <h1>Resume Checker</h1>
          <p className="subtitle">
            Upload your resume below for a <strong>free resume scan</strong>
          </p>
        </div>
        
        <div className="content-wrapper">
          <div className="domain-select">
            <label htmlFor="domain-dropdown">Target Domain</label>
            <select 
              id="domain-dropdown"
              value={domain} 
              onChange={handleDomainChange}
            >
              <option value="">Select Target Domain (optional)</option>
              {DOMAIN_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          
          <div
            className={`dropzone${dragActive ? " active" : ""}${file ? " has-file" : ""}`}
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
            <div className="dropzone-content">
              {file ? (
                <>
                  <div className="file-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <div className="file-info">
                    <span className="selected-file-name">{file.name}</span>
                    <span className="file-action">Click to change file</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="upload-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <div className="upload-text">
                    <p className="primary-text">Drag & drop your resume here</p>
                    <p className="secondary-text">or click to browse files</p>
                    <p className="supported-formats">Supported formats: PDF, TXT</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                <span>Analyzing...</span>
              </>
            ) : (
              "Scan Resume"
            )}
          </button>
        </div>
      </div>
      
      {results && (
        <div className="results-container">
          {results.error ? (
            <div className="error-panel">
              <div className="error-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div className="error-message">{results.error}</div>
            </div>
          ) : (
            <div className="results-panel">
              <div className="results-header">
                <h2>Scan Results</h2>
                <div className="match-indicator">
                  <div className="match-percentage">
                    <svg viewBox="0 0 36 36" className="circular-chart">
                      <path className="circle-bg"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path className="circle"
                        strokeDasharray={`${results.match_percentage}, 100`}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <text x="18" y="20.35" className="percentage">{results.match_percentage}%</text>
                    </svg>
                  </div>
                  <span>ATS Match</span>
                </div>
              </div>
              
              <div className="results-content">
                <div className="profile-section">
                  <h3>Profile Information</h3>
                  <div className="info-grid">
                    {results.name && (
                      <div className="info-item">
                        <div className="info-label">Name</div>
                        <div className="info-value">{results.name}</div>
                      </div>
                    )}
                    {results.email && (
                      <div className="info-item">
                        <div className="info-label">Email</div>
                        <div className="info-value">{results.email}</div>
                      </div>
                    )}
                    {results.phone && (
                      <div className="info-item">
                        <div className="info-label">Phone</div>
                        <div className="info-value">{results.phone}</div>
                      </div>
                    )}
                    {results.linkedin && (
                      <div className="info-item">
                        <div className="info-label">LinkedIn</div>
                        <div className="info-value">
                          <a href={results.linkedin} target="_blank" rel="noopener noreferrer">
                            {results.linkedin}
                          </a>
                        </div>
                      </div>
                    )}
                    {results.github && (
                      <div className="info-item">
                        <div className="info-label">GitHub</div>
                        <div className="info-value">
                          <a href={results.github} target="_blank" rel="noopener noreferrer">
                            {results.github}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="skills-section">
                  <h3>Skills Assessment</h3>
                  
                  {results.skills && results.skills.length > 0 && (
                    <div className="skills-block">
                      <div className="block-title">Current Skills</div>
                      <div className="skills-list">
                        {results.skills.map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {results.missing_skills && results.missing_skills.length > 0 && (
                    <div className="skills-block">
                      <div className="block-title">Recommended Skills to Learn</div>
                      <div className="skills-list missing-skills">
                        {results.missing_skills.map((skill, index) => (
                          <span key={index} className="skill-tag missing">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {results.categorized_skills && Object.keys(results.categorized_skills).length > 0 && (
                    <div className="skills-block">
                      <div className="block-title">Skills by Category</div>
                      <div className="categories-grid">
                        {Object.entries(results.categorized_skills).map(([category, skills]) => (
                          <div key={category} className="category-item">
                            <div className="category-name">{category}</div>
                            <div className="category-skills">
                              {skills.map((skill, index) => (
                                <span key={index} className="skill-tag">{skill}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
