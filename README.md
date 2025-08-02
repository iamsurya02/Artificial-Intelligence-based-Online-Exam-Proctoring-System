# 🧠 Artificial Intelligence-based Online Exam Proctoring System

This project is a **real-time AI-powered proctoring system** built to ensure integrity during online exams by leveraging facial recognition, behavior tracking, and browser activity monitoring. It replaces traditional human invigilation with smart automation, boosting both security and scalability.

---

## 👨‍💻 Developed By

- **P. Puneeth** – bl.en.u4cse22142@bl.students.amrita.edu  
- **G. Surya Narayana Reddy** – bl.en.u4cse22113@bl.students.amrita.edu  
- **P. Satwika Chowdary** – bl.en.u4cse22139@bl.students.amrita.edu  
- **Mentor:** *Kavitha C.R.*, Amrita Vishwa Vidyapeetham

---

## 🎯 Core Features

- 🔐 **Secure Login & Registration** using bcrypt & tokenized email verification
- 🎥 **Real-time Face Detection** via OpenCV Haar Cascades
- 👁️ **Eye Gaze & Blink Tracking** using Dlib facial landmarks
- 📐 **Head Pose Estimation** for monitoring attention and focus
- 📸 **Multi-Face & Object Detection** (phones, papers, headphones) via TensorFlow Lite
- 🧏‍♂️ **Audio Monitoring** using PyAudio & Winsound
- 🌐 **Browser Activity Monitoring** (tab switch, fullscreen exit, keyboard shortcuts)
- ⏱️ **Time-Bound Quiz** with randomized questions per user
- 🔥 **Firebase Logging** of violations with timestamps and snapshots
- 📊 **Score Tracking + Event Logging** for post-exam audit trails

---

## 🧱 System Architecture

```plaintext
[User] --> [Flask Web Server] --> [Frontend: HTML/CSS/JS]
                         |
                         +--> [AI Modules: OpenCV, Dlib, TensorFlow Lite]
                         |
                         +--> [MySQL for Auth]
                         |
                         +--> [Firebase for Violation Logging]
