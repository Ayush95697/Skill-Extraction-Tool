# 📄 Resume Skills Extractor

**Resume Skills Extractor** is an intelligent, domain-specific web application that allows users to upload their resume and receive detailed insights based on their chosen job domain. The tool evaluates the candidate’s existing skills, highlights missing or in-demand skills, and generates a candidate fit score with respect to the selected role.

Built using **Python**, **Streamlit**, and **NLP techniques**, this tool simulates an **ATS (Applicant Tracking System)** that helps both job seekers and HR professionals optimize resumes for specific roles.

---

## 🚀 Features

### 📤 Resume Upload
- Accepts resumes in PDF format
- Parses and extracts relevant text content using NLP

### 🎯 Domain Selection
- Users select a domain (e.g., Data Science, Web Development, Android, UI/UX, etc.)
- The system compares resume content with a curated skillset per domain

### 🧠 Skill Extraction Engine
- Uses keyword matching + NLP techniques to extract:
  - **Existing Skills**
  - **Missing or Recommended Skills**
- Compares resume content with predefined skill benchmarks for each role

### 📊 Candidate Fit Score
- Calculates a **Fit Score** (e.g., 59%) based on skill overlap
- Helps candidates understand how well their profile aligns with the selected domain

### 🧾 Detailed Output
- Candidate Details (Name, Email, etc. if found)
- Existing Skills from Resume
- Missing Skills for the Chosen Role
- Overall ATS Compatibility Score

---

## 💡 Use Cases

- ✅ Job seekers optimizing resumes for specific job roles
- ✅ Career coaches and placement cells assessing student readiness
- ✅ ATS simulation and pre-screening in recruitment processes

---

## 🧠 Tech Stack

| Tech | Usage |
|------|-------|
| **Python** | Core logic and NLP |
| **Streamlit** | Web-based UI |
| **spaCy / NLTK** | NLP for text extraction  |
| **PyPDF2 / pdfminer.six** | PDF parsing |
| **Custom JSON / CSV** | Domain-specific skill sets |

---



## 📁 Project Structure
Resume-Skills-Extractor/
│
├── app.py # Main Streamlit app

├── resume_parser.py # Resume text extraction logic

├── skill_matcher.py # Skill comparison logic

├── domain_skills.json # Domain to skill mapping file

├── requirements.txt

└── sample_resume.pdf




---

## 📈 Future Enhancements

- 🧠 Add LLM-based smart skill suggestions (e.g., OpenAI)
- 📧 Email the fit report to users
- 🔐 Login system for candidate history
- 📂 Bulk resume upload for HR use
- 📊 Dashboard analytics for colleges or hiring teams

---

## 👨‍💻 Author

**Ayush Mishra**  
B.Tech CSE | AI/ML Enthusiast  
📧 [ayushmishra7548@gmail.com](mailto:ayushmishra7548@gmail.com)  
🔗 [LinkedIn](https://linkedin.com/in/yourprofile) | [GitHub](https://github.com/yourgithub)  
🎓 Raj Kumar Goel Institute of Technology (RKGIT), 2027

---

## 📃 License

This project is open-source and available for learning, non-commercial use.  
Fork it, star it, or build on it!



