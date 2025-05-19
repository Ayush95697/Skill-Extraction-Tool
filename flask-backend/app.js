import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSkills([]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/extract-skills",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setSkills(res.data.skills);
    } catch (err) {
      alert("Error extracting skills!");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", textAlign: "center" }}>
      <h2>Resume Skill Extractor</h2>
      <input type="file" accept=".pdf,.txt" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? "Extracting..." : "Extract Skills"}
      </button>
      <div style={{ marginTop: 30 }}>
        {skills.length > 0 && (
          <div>
            <h4>Extracted Skills:</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    background: "#e0e0e0",
                    borderRadius: "20px",
                    padding: "6px 14px",
                    fontSize: "1rem",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
