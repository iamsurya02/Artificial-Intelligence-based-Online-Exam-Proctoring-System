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


```

## ⚙️ Technologies Used

- **Languages:** Python, JavaScript, HTML, CSS  
- **Frameworks:** Flask (backend), Bootstrap (UI)  
- **Libraries:** OpenCV, Dlib, TensorFlow Lite, PyAudio, bcrypt  
- **Database:** MySQL  
- **Cloud Services:** Firebase Realtime Database  

---

## 📈 Results Summary

| Feature                   | Accuracy |
|---------------------------|----------|
| Face Detection            | 94%      |
| Gaze Tracking             | 90%      |
| Head Pose Estimation      | 92%      |
| Object Detection (YOLO)   | 85%      |
| Overall Proctoring Engine | 92%      |

- Average of **1.8 violations per user** detected  
- Full violation logs stored with **timestamps + snapshots**  
- All user scores logged automatically in Firebase  

---

## 🚀 Future Enhancements

- 🎙️ Add voice activity detection  
- 🧠 Behavioral scoring model (e.g., cheat probability)  
- 🛡️ Biometric login (face or fingerprint auth)  
- 📲 Mobile browser detection & system-level event hooks  

---

## 📬 Contact

- **Surya Narayana Reddy**  
📧 g.suryareddy2004@gmail.com  
🌐 [GitHub Profile](https://github.com/iamsurya02)
