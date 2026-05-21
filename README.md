# 🥦 NutriMind — AI-Powered Personalized Diet Planner

NutriMind is a modern, high-fidelity frontend web application that generates fully tailored, professional 7-day diet plans. By analyzing custom physiological details, lifestyle habits, and dietary goals, it compiles personalized meal configurations, caloric energy targets, and macronutrient breakdowns using **Google Gemini 1.5 Flash** (via direct AI Studio API calls or built-in premium offline mock overrides).

Once compiled, users can interact with a responsive dietitian dashboard and instantly download their complete plan as a sharp, print-optimized multi-page PDF.

---

## ✨ Features

- 📋 **5-Step Personalization Wizard**:
  - **Step 1 (Physical Profile)**: Ingests age, biological sex, height, and weight with real-time field-boundary validation.
  - **Step 2 (Primary Goal)**: Dynamic calorie adjustment scaling for *Lose weight*, *Build muscle*, *Gain weight*, *Maintain composition*, or *Healthy eating*.
  - **Step 3 (Lifestyle & Habits)**: Accommodates active sleep hours, daily water glass tallies, and safety guidance for clinical medical conditions.
  - **Step 4 (Preferences & Safety)**: Custom selections for diet categories (Vegetarian, Non-Veg, Vegan, Eggetarian), food allergies (exclusive toggles), and preferred culinary cuisines.
  - **Step 5 (Profile Assessment)**: Displays estimated Basal Metabolic Rate (BMR) metrics using the Mifflin-St Jeor formula before sending inputs to the model.
- 🌀 **Animated Wellness Loading Ticker**: Entertains users with shifting clinical status checkpoints and evidence-based nutrition tips during API wait times.
- 📊 **Dietitian Assessment Dashboard**:
  - Circular caloric energy gauge displaying daily targets.
  - Interactive progress meters showing exact gram distributions of Proteins, Carbs, and Fats.
  - Interactive calendar timeline showing daily meal plans (2 to 5 meals/day options).
  - Categorized side-by-side lists for goal-specific diet tips and forbidden ingredients warnings.
- 📄 **Crisp PDF Exporter**: Renders the complete dashboard into a sharp, multi-page A4 PDF using high-resolution canvas scaling (`html2canvas` + `jsPDF`).
- 🔑 **On-the-Fly API Key Credential Manager**: A secure overlay modal to input Gemini API keys stored locally in browser session states. Auto-falls back to high-fidelity mocks if empty.

---

## 🛠️ Technical Stack

- **Framework**: [React.js](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Validation**: [React Hook Form](https://react-hook-form.com/) + [Yup Resolver](https://github.com/jquense/yup)
- **AI Model**: [Google Gemini 1.5 Flash](https://ai.google.dev/)
- **PDF Compilation**: [html2canvas](https://html2canvas.hertzen.com/) & [jsPDF](https://rawgit.com/MrRio/jsPDF/master/docs/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Installation
Navigate into the directory and install all of the project library dependencies:
```bash
cd ~/Desktop/nutrimind
npm install
```

### 2. Configure Credentials (Optional)
To set a default API key, copy the environment file and replace the placeholder value:
```bash
cp .env.example .env  # Or simply open the .env file in the root
```
In `.env`:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
*Note: If no API key is specified, NutriMind automatically operates in **Mock Mode**, allowing you to test all capabilities immediately using built-in dietitian metrics.*

### 3. Launch Development Server
Launch the local Vite server:
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser to view the application.

### 4. Build for Production
To bundle the project into optimized, minified static files:
```bash
npm run build
```

---

## 📄 License
This project is open-source and available under the MIT License.
