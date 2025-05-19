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
  const [domain, setDomain] = useState("");
  const [skills, setSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [matchPercent, setMatchPercent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [categorizedSkills, setCategorizedSkills] = useState({});
  const [linkedin, setLinkedin] = useState(null);
  const [github, setGithub] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [name, setName] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSkills([]);
    setMissingSkills([]);
    setFileUploaded(false);
    setDomain("");
    setMatchPercent(null);
    setCategorizedSkills({});
    setLinkedin(null);
    setGithub(null);
    setEmail(null);
    setPhone(null);
    setName(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setSkills([]);
    setMissingSkills([]);
    setFileUploaded(false);
    setMatchPercent(null);
    setCategorizedSkills({});
    setLinkedin(null);
    setGithub(null);
    setEmail(null);
    setPhone(null);
    setName(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      await axios.post(
        "https://skill-extraction-tool.onrender.com/extract-skills",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setFileUploaded(true);
    } catch (err) {
      alert("Error uploading file!");
    }
    setLoading(false);
  };

  const handleDomainChange = async (e) => {
    const selectedDomain = e.target.value;
    setDomain(selectedDomain);
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("domain", selectedDomain);

    setLoading(true);
    try {
      const res = await axios.post(
        "https://skill-extraction-tool.onrender.com/extract-skills",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setSkills(res.data.skills);
      setMissingSkills(res.data.missing_skills);
      setMatchPercent(res.data.match_percentage);
      setCategorizedSkills(res.data.categorized_skills);
      setLinkedin(res.data.linkedin);
      setGithub(res.data.github);
      setEmail(res.data.email);
      setPhone(res.data.phone);
      setName(res.data.name);
    } catch (err) {
      alert("Error extracting skills!");
    }
    setLoading(false);
  };

  const renderCategorizedSkills = () => {
    const categories = Object.keys(categorizedSkills);
    if (categories.length === 0) return null;
    return (
      <div className="categories-container">
        <h4>Skills by Category</h4>
        {categories.map(category => (
          <div key={category} className="category-block">
            <strong>{category}:</strong>
            <div className="skills-list">
              {categorizedSkills[category].map(skill => (
                <span key={skill} className="skill-tag found">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <h2 className="title">Resume Skill Analyzer</h2>
      <div className="upload-section">
        <span className="file-input-wrapper">
          <label htmlFor="resume-upload" className="choose-file-btn">
            Choose Resume
          </label>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileChange}
            className="file-input"
          />
          <span className="selected-file-name">
            {file ? file.name : "No file chosen"}
          </span>
        </span>
        <br />
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="upload-button"
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </button>
      </div>
      {fileUploaded && (
        <div className="domain-selector">
          <label>
            Select Target Domain:{" "}
            <select
              value={domain}
              onChange={handleDomainChange}
              className="domain-dropdown"
            >
              <option value="">--Choose Domain--</option>
              {DOMAIN_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
        </div>
      )}
      <div className="results-section">
        {(name || email || phone) && (
          <div className="candidate-details">
            <h3>Candidate Details</h3>
            {name && <div><strong>Name:</strong> {name}</div>}
            {email && <div><strong>Email:</strong> {email}</div>}
            {phone && <div><strong>Phone:</strong> {phone}</div>}
          </div>
        )}
        {(linkedin || github) && (
          <div className="profile-links">
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-btn linkedin"
              >
                LinkedIn Profile
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-btn github"
              >
                GitHub Profile
              </a>
            )}
          </div>
        )}
        {skills.length > 0 && (
          <div className="skills-container">
            <h3 className="section-title">Your Skills for {domain}:</h3>
            <div className="skills-list">
              {skills.map((skill) => (
                <span key={skill} className="skill-tag found">{skill}</span>
              ))}
            </div>
          </div>
        )}
        {missingSkills.length > 0 && (
          <div className="skills-container">
            <h3 className="section-title missing-title">Skills to Learn for {domain}:</h3>
            <div className="skills-list">
              {missingSkills.map((skill) => (
                <span key={skill} className="skill-tag missing">{skill}</span>
              ))}
            </div>
          </div>
        )}
        {matchPercent !== null && (
          <div className="match-percentage">
            <div className="percentage-text">
              Domain Match: <span className="percentage-value">{matchPercent}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${matchPercent}%` }}
              ></div>
            </div>
          </div>
        )}
        {renderCategorizedSkills()}
      </div>
    </div>
  );
}

export default App;
