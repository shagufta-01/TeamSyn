# **Teamsync** 🚀  

## *Demo Here* [Teamsync](https://team-sync-09eeee.vercel.app/)
### **A Powerful Team Collaboration & Project Management Tool**  

## 📌 **Overview**  
**Teamsync** is a modern **team collaboration and task management platform** designed to streamline workflow, enhance productivity, and improve communication among team members. It provides real-time collaboration, efficient project tracking, and seamless task management.  

---

## 🎯 **Features**  
✅ **User Authentication & Role Management**  
✅ **Task & Project Management** *(Create, Assign, Track Progress)*  
✅ **Board for Task Visualization**  
✅ **Deadline Reminders & Calendar Integration**  
✅ **Performance Analytics & Reporting**  


---

## 🏗️ **Tech Stack**  
### **Frontend:**  
- React.js (UI Framework)  
- Tailwind CSS (Styling)  
- Redux (State Management)  

### **Backend:**  
- Node.js & Express.js (Server & API)  
- MongoDB (Database)  
 

### **Deployment & DevOps:**  
- vercel / render / (Hosting)  
 

---

## 🔧 **Installation & Setup**  

### **1️⃣ Clone the Repository**  
```bash
git clone https://github.com/yourusername/teamsync.git
cd teamsync
```

### **2️⃣ Install Dependencies**  
#### Backend  
```bash
cd backend
npm install
```
#### Frontend  
```bash
cd frontend
npm install
```

### **3️⃣ Configure Environment Variables**  
Create a **.env** file in the backend directory and add the following:  
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```

### **4️⃣ Start the Application**  
#### Run Backend Server  
```bash
cd backend
npm start
```
#### Run Frontend  
```bash
cd frontend
npm start
```
Your app should now be running at `http://localhost:3000` 🚀  

---

## 🔍 **API Endpoints**  
| Method | Endpoint           | Description            | Authentication |
|--------|--------------------|------------------------|---------------|
| POST   | `/api/auth/signup` | Register a new user    | ❌           |
| POST   | `/api/auth/login`  | User login & JWT token | ❌           |
| GET    | `/api/tasks`       | Fetch all tasks        | ✅           |
| POST   | `/api/tasks`       | Create a new task      | ✅           |

For detailed API documentation, check **API_DOCS.md** 📖  

---

---

## 🚀 **Deployment**  
- **Frontend:**Vercel 
- **Backend:** Hosted onRender  
- **Database:** MongoDB Atlas  

---

## 💡 **Future Enhancements**  
- AI-powered task suggestions  
- Video conferencing integration  
- Mobile App version (React Native)  

---

## 🤝 **Contributors**  
- **Owaais Nazir** - *Developer & Maintainer*  

---

## 📝 **License**  
This project is **MIT Licensed**.  
