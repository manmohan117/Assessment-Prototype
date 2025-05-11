# 🌐 Network Assessment Prototype Website

A prototype web application for performing structured network assessments using Excel-based templates. This tool is designed to streamline the process of evaluating network infrastructure by analyzing assessment areas, scoring responses, and generating actionable reports with tailored recommendations.

---

## 📋 Overview

The Network Assessment Prototype Website allows users to **upload an Excel file** containing predefined assessment areas, questions, scores, and recommendations. Based on the uploaded data, the system processes the input, evaluates the scores, and generates a comprehensive report summarizing the network's current status and offering improvement suggestions.

---

## 🚀 Key Features

- **📁 Excel File Upload**  
  Upload structured `.xlsx` files with assessment questions and scoring fields.

- **📊 Automated Score Analysis**  
  Calculates total and section-wise scores from the uploaded file.

- **🧠 Recommendation Engine**  
  Matches low scores to corresponding improvement suggestions.

- **📄 Report Generation**  
  Creates a downloadable, well-formatted assessment report in HTML or PDF.

- **🖥️ Clean UI**  
  Intuitive interface for uploading files, viewing results, and downloading reports.

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript (or React/Vue)
- **Backend:** Python (Flask or Django)
- **Libraries:**
  - `pandas` – Excel file processing
  - `openpyxl` – Excel parsing
  - `jinja2` or `WeasyPrint` – Report templating and PDF export
- **Optional:** Bootstrap / Tailwind CSS for styling

---

## 📂 Excel Template Format

Ensure your Excel file follows this structure:

| Assessment Area | Question | Score (0–5) | Recommendation |
|------------------|----------|-------------|----------------|
| Network Security | Are firewalls in place? | 4 | Implement basic firewall rules |
| Network Design   | Is redundancy built in? | 2 | Add failover and redundant links |

- **Assessment Area:** The category of the question.
- **Question:** A specific item being assessed.
- **Score:** A numeric value indicating compliance or completeness.
- **Recommendation:** Suggested actions for improvement if score is low.

---

## 📈 Example Output

After processing the uploaded file, the app generates a report that includes:

- Average score per assessment area
- Highlighted weak areas (e.g., scores ≤ 2)
- A table of matched recommendations
- Downloadable PDF or HTML summary

---

## ✅ Getting Started

### Prerequisites

- Python 3.9+
- `pip` package manager

### Installation

```bash
git clone https://github.com/yourusername/network-assessment-prototype.git
cd network-assessment-prototype
pip install -r requirements.txt
