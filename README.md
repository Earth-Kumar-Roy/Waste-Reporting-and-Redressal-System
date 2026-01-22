# 🗑️ Waste Reporting & Redressal System

**A digital platform for transparent, accountable, and location-accurate waste management.**

The **Waste Reporting & Redressal System** is a web-based solution designed to connect citizens, sanitation workers, and administrators through a structured reporting and verification workflow. By combining GPS-based location capture, image verification, and AI-assisted validation, the system ensures that reported waste issues are genuine and resolved efficiently.

---

## 🎯 The Problem
* Slow and fragmented reporting mechanisms  
* No reliable proof of task completion  
* Fake or irrelevant image submissions  
* Difficulty locating waste hotspots in dense urban areas  

---

## ✅ The Solution
* **📍 Automatic GPS capture** to eliminate location ambiguity  
* **📸 Mandatory cleanup image upload** before task closure  
* **🤖 AI-based image validation (Google AI Edge – MediaPipe)** to detect whether uploaded images actually contain garbage  
* **🧭 Region-based task allocation** for sanitation workers  
* **📬 Status-driven communication** with citizens and workers  
* **🛡️ Admin-controlled worker verification** using ID proof and approval workflow  

---

## ⚙️ How It Works

### For Citizens
1. Upload a waste image (validated using on-device AI)
2. GPS location is captured automatically
3. Receive a Ticket ID
4. Track status until resolution

### For Workers
1. Register and submit ID proof  
2. Await admin approval (email notification)  
3. Log in after approval  
4. View region-specific tasks  
5. Upload post-cleanup proof and close tasks  

### For Admin
1. Review pending worker applications  
2. Approve or reject with personalized emails  
3. Monitor worker accounts and task progress  

---

## 🏗️ Tech Stack
* **Frontend:** HTML5, Tailwind CSS, JavaScript  
* **AI:** Google AI Edge (MediaPipe)  
* **Backend:** Google Apps Script  
* **Database:** Google Sheets  
* **File Storage:** Google Drive  

---

## 🌍 Demo Regions
`Esplanade` • `Sealdah` • `Howrah` • `Bidhannagar` • `Dum Dum` • `New Town` • `Baranagar` (10 regions total)

---

## 🔗 Project Links
* **GitHub:** https://github.com/Earth-Kumar-Roy/Waste-Reporting-and-Redressal-System  
* **Demo Video:** https://drive.google.com/file/d/1tJ5OL42GCBbg8VczqomeRGc3drReslYQ/view  
* **Live MVP:** https://script.google.com/macros/s/AKfycbxVnOaKrpqmV6QaCJckDzjkCHD7WEAD4BTTGQ7kaTEOpwKkOI26fWqgK-ZezWnXBTE/exec  

---

Developed and maintained by **Earth Kumar Roy**.
