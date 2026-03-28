<div align="center">
  <h1>🛡️ AI-Proctor</h1>
  <p><b>A Next-Generation, Intelligent Exam Portal with Automated Proctoring and Automatic Grading</b></p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version" />
    <img src="https://img.shields.io/badge/node-%3E%3D%2018.x-brightgreen.svg" alt="Node Version" />
    <img src="https://img.shields.io/badge/react-%5E19.0.0-blue?logo=react" alt="React" />
    <img src="https://img.shields.io/badge/express-api-lightgrey.svg" alt="Express" />
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
  </p>
</div>

<hr/>

## 📖 What is this?

**AI-Proctor** is an advanced, end-to-end examination platform designed to ensure academic integrity in remote testing environments. It combines a modern React frontend with a robust Express/MongoDB backend, all supercharged by AI-driven proctoring and automated assessment features. 

The platform leverages **TensorFlow.js (Universal Sentence Encoder)** and **face-api.js** to evaluate semantic similarity in subjective answers, detect potential plagiarism, and monitor user behavior in real-time through the webcam.

## ✨ Key Features

- 👁️ **Real-Time Behavior Monitoring:** Uses `face-api.js` to continuously track face presence and gaze direction securely on the client side. Warns users automatically and locks the exam after repeated violations.
- 🧠 **AI-Powered Automated Grading:** Analyzes and grades descriptive and essay-type questions by calculating semantic similarity scores with reference answers using TensorFlow's Universal Sentence Encoder.
- 🕵️ **Plagiarism Detection:** Deep integration with an isolated Python-based microservice to flag copy-pasted or unoriginal responses.
- 👨‍💻 **Role-Based Portals:**
  - **Admin Dashboard:** Create new exams, curate questions (MCQs & Descriptive), evaluate student submissions, and perform manual reviews on flagged/low-confidence exams.
  - **Student Dashboard:** View upcoming exams, undergo automated proctored tests, and review performance profiles.
- ⚡ **Responsive UI:** A clean, accessible, and fast web interface crafted using React.js.

## 🗂️ Project Structure

```bash
AI-Proctor/
├── Frontend/                 # React Frontend Application
│   ├── public/models/        # face-api.js pre-trained models
│   ├── src/                  # React source files (Pages, Components)
│   │   ├── components/       # NavBar, BehaviorMonitor, FaceCapture
│   │   └── pages/            # AdminDashboard, StartExam, ManualReview, etc.
│   └── plag-service/         # Python environment for Plagiarism Microservice
├── backend/                  # Node.js + Express Backend App
│   ├── models/               # Mongoose Database Models (Users, Exams, Responses)
│   ├── routes/               # Express API Routes
│   └── utils/                # AI Utility scripts (Similarity, Plagiarism Connectors)
└── README.md                 # You are here!
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (^19.0.0) + React Router v7
- **AI Libraries:** `@tensorflow/tfjs`, `face-api.js` (Webcam behavior monitoring)
- **Networking:** Axios API client

### Backend
- **Server:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **AI/ML Utilities:** 
  - `@tensorflow-models/universal-sentence-encoder`
  - `string-similarity`

## ⚙️ Prerequisites

Make sure you have the following installed on your machine:
- **Node.js**: `v18.x` or higher
- **NPM**: `v9.x` or higher
- **MongoDB**: Local instance running, or an Atlas Cluster URI.
- **Python**: `v3.10`+ (For the Plagiarism validation microservice)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/AI-Proctor.git
cd AI-Proctor
```

### 2. Configure & Start the Backend
```bash
cd backend

# Install dependencies
npm install

# Setup Environment variables
# Create a .env file locally with the following inputs:
echo "PORT=5000" > .env
echo "MONGO_URI=your_mongodb_connection_string" >> .env

# Start the server
npm start
```

### 3. Start the Plagiarism Checking Microservice (Python)
The backend expects a local plagiarism checking service running on `http://127.0.0.1:8000/check-plagiarism`.
```bash
cd ../Frontend/plag-service

# Activate the venv and install dependencies 
# (Replace with python specific start commands if app.py e.g. FastAPI/Flask)
source .venv/bin/activate 
pip install -r requirements.txt

# Start the python microservice
python app.py  # or uvicorn
```

### 4. Configure & Start the Frontend
```bash
# Open a new terminal instance
cd ../Frontend

# Install dependencies
npm install

# Start the React development server
npm start
```
By default, the frontend runs on `http://localhost:3000`.

## 📸 Screenshots & Walkthrough

| **Student Exam View (Proctored)** | **Admin Exam Creation Dashboard** |
| :---: | :---: |
| <img src="https://via.placeholder.com/600x350.png?text=Proctored+Exam+Interface" alt="Exam Interface"> | <img src="https://via.placeholder.com/600x350.png?text=Admin+Dashboard" alt="Admin Interface"> |
| _Webcam stream securely monitoring user presence._ | _Admin creating MCQs and setting reference answers._ |

| **Manual Review UI** | **Behavior Warning Status** |
| :---: | :---: |
| <img src="https://via.placeholder.com/600x350.png?text=Manual+Review+Gradeable+Submissions" alt="Manual Review"> | <img src="https://via.placeholder.com/600x350.png?text=Behavior+Warnings" alt="Status Info"> |
| _Similarity comparisons against reference texts._ | _Auto-lock notifications triggered securely._ |

> _(Note: Replace placeholders with real project screenshots later)_

## 🧑‍💻 Usage Instructions
1. **Register as an Admin:** Start by creating an account and selecting 'Admin' as your profile type. Use the dashboard to define an exam scope, create Multiple-Choice & Descriptive questions, and assign reference answers.
2. **Register as a Student:** Log in using student credentials, opt into the newly generated exams, and click **Start Exam**.
3. **Allow Webcam API:** You **must** grant permissions for the webcam tracking scripts; without it, the exam will strictly deny start. Keep your face inside the boundaries during the test.
4. **Submit & Review:** Auto-grading happens asynchronously upon submit. Admins can hit the **Manual Review** tab to finalize marks derived by TensorFlow inferences.

## 🤝 Contributing

Contributions, issues, and feature requests are always welcome!
Feel free to check out the [issues page](../../issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
<div align="center">
Made with ❤️ by the AI-Proctor Developer Team
</div>