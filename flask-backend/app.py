from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
import re
from collections import defaultdict

DOMAIN_SKILLS = {
    "Web Developer": [
        "html", "css", "javascript", "react", "angular", "vue", "node.js", "express", "django", "flask", "git", "bootstrap", "sass", "webpack"
    ],
    "AI/ML Engineer": [
        "python", "machine learning", "deep learning", "tensorflow", "pytorch", "scikit-learn", "data analysis", "pandas", "numpy", "matplotlib", "keras", "opencv", "nlp", "computer vision"
    ],
    "Software Developer": [
        "java", "python", "c++", "c#", "git", "sql", "linux", "oop", "data structures", "algorithms", "unit testing", "api", "rest", "docker", "aws", "azure"
    ],
    "Data Scientist": [
        "python", "r", "machine learning", "data analysis", "statistics", "pandas", "numpy", "matplotlib", "seaborn", "sql", "tableau", "power bi", "scikit-learn", "ai", "big data"
    ],
    "Mobile Developer": [
        "android", "kotlin", "java", "swift", "ios", "react native", "flutter", "dart", "objective-c", "firebase", "sqlite"
    ]
}

SKILL_CATEGORIES = {
    "Programming": [
        "python", "java", "c++", "c#", "javascript", "kotlin", "swift", "dart", "r"
    ],
    "Web Frameworks": [
        "django", "flask", "react", "angular", "vue", "node.js", "express", "bootstrap", "sass", "webpack"
    ],
    "AI/ML": [
        "machine learning", "deep learning", "tensorflow", "pytorch", "scikit-learn", "keras", "opencv", "nlp", "computer vision", "ai"
    ],
    "Data Analysis": [
        "pandas", "numpy", "matplotlib", "seaborn", "data analysis", "statistics", "big data"
    ],
    "Databases": [
        "sql", "sqlite", "tableau", "power bi"
    ],
    "Cloud/DevOps": [
        "docker", "aws", "azure", "firebase", "git", "linux"
    ],
    "Mobile": [
        "android", "ios", "react native", "flutter", "objective-c"
    ],
    "Soft Skills": [
        "communication", "teamwork", "leadership", "problem solving", "critical thinking"
    ],
    "Other Tools": [
        "unit testing", "oop", "data structures", "algorithms", "api", "rest"
    ]
}

app = Flask(__name__)
CORS(app)

def extract_text_from_pdf(file_stream):
    doc = fitz.open(stream=file_stream.read(), filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def extract_links(text):
    linkedin = None
    github = None

    # Find all URLs in the text
    url_pattern = re.compile(r'https?://[^\s,;)\]<>"]+', re.IGNORECASE)
    urls = url_pattern.findall(text)

    for url in urls:
        clean_url = url.strip().rstrip('.,;)')
        if not linkedin and "linkedin.com" in clean_url.lower():
            linkedin = clean_url
        if not github and "github.com" in clean_url.lower():
            github = clean_url
        if linkedin and github:
            break
    return linkedin, github


def extract_email(text):
    match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    return match.group(0) if match else None

def extract_phone(text):
    match = re.search(r'(\+?\d{1,3}[-.\s]?)?(\(?\d{3,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4,10}', text)
    return match.group(0) if match else None

def extract_name(text):
    lines = text.split('\n')
    for line in lines:
        words = line.strip().split()
        if 1 < len(words) < 4 and all(w[0].isupper() for w in words if w):
            return line.strip()
    return None

def extract_skills(text, domain=None):
    text_lower = text.lower()
    found_skills = set()
    skills_to_check = []
    if domain and domain in DOMAIN_SKILLS:
        skills_to_check = DOMAIN_SKILLS[domain]
    else:
        for skills in DOMAIN_SKILLS.values():
            skills_to_check.extend(skills)
    for skill in skills_to_check:
        if skill in text_lower:
            found_skills.add(skill.title())
    match_percentage = 0
    missing_skills = []
    if domain and domain in DOMAIN_SKILLS:
        total = len(DOMAIN_SKILLS[domain])
        if total > 0:
            match_percentage = int(100 * len(found_skills) / total)
        missing_skills = [skill.title() for skill in DOMAIN_SKILLS[domain] if skill.title() not in found_skills]
    categorized = defaultdict(list)
    for category, skills in SKILL_CATEGORIES.items():
        for skill in skills:
            if skill.title() in found_skills:
                categorized[category].append(skill.title())
    return list(found_skills), match_percentage, missing_skills, dict(categorized)

@app.route("/extract-skills", methods=["POST"])
def extract_skills_route():
    if 'resume' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['resume']
    domain = request.form.get('domain')
    if file.filename.endswith('.pdf'):
        text = extract_text_from_pdf(file.stream)
    elif file.filename.endswith('.txt'):
        text = file.read().decode("utf-8")
    else:
        return jsonify({"error": "Unsupported file type"}), 400

    linkedin, github = extract_links(text)
    email = extract_email(text)
    phone = extract_phone(text)
    name = extract_name(text)
    skills, match_percentage, missing_skills, categorized = extract_skills(text, domain)
    return jsonify({
        "skills": skills,
        "match_percentage": match_percentage,
        "missing_skills": missing_skills,
        "categorized_skills": categorized,
        "linkedin": linkedin,
        "github": github,
        "email": email,
        "phone": phone,
        "name": name
    })

if __name__ == "__main__":
    app.run(debug=True)
