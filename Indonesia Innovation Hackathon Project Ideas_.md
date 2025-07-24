### **1\. Background: The Guardians of Indonesian Heritage**

For over 50 years, the **Indonesia Heritage Society (IHS)** has been a cornerstone of cultural preservation in Indonesia. As a non-profit organization powered entirely by a diverse group of over 100 volunteers from 30+ nationalities, IHS plays a vital role in making Indonesia's rich history accessible to all. Through partnerships with leading cultural institutions, they provide essential services like free museum tours, educational programs, and a public library. Their work is a testament to the power of community and a shared passion for heritage.

### **2\. The Problem Statement: An Inflection Point**

Despite its long history of success, IHS stands at a critical **inflection point**. The manual, analog systems that have served them for decades are now limiting their potential and creating significant operational friction. To continue thriving for the next 50 years, they must overcome three core challenges:

1. **The Attention Half-Life:** In a world of digital noise, keeping a large, diverse volunteer base consistently engaged is a major struggle. Generic broadcast messages in large WhatsApp groups get lost, and valuable volunteers lose connection with the mission, leading to a high churn rate.  
2. **The Data Vacuum:** Critical volunteer information—skills, availability, interests, and history—is scattered across disconnected Excel spreadsheets. This "data vacuum" makes it nearly impossible for coordinators to know who the right person is for a specific task, leading to inefficient allocation of their most precious resource: volunteer time.  
3. **Operational Drag:** The reliance on manual coordination creates a significant administrative burden. Time that could be spent on high-impact cultural programs is instead spent on tedious logistical tasks, hindering the organization's ability to scale its impact.

### **3\. The Solution: Tresno Boedoyo**

**Tresno Boedoyo** is an AI-powered platform designed to solve these challenges by transforming how the Indonesia Heritage Society manages, engages, and sustains its volunteer community. It's a smart, centralized hub that replaces chaos with clarity and manual effort with intelligent automation.

The solution is structured around the hackathon's four key frameworks:

#### **CAPTURE: From Spreadsheets to Smart Profiles**

We replace static Excel files with dynamic, intelligent volunteer profiles. During a conversational onboarding, the app captures crucial data points:

* **Skills:** Languages spoken, public speaking, graphic design, research, etc.  
* **Interests:** Preferred museums, historical periods, types of tasks (e.g., tours, translation, event support).  
* Availability: General availability (e.g., weekends, weekday afternoons).  
  This creates a rich, structured, and instantly searchable database—the single source of truth for the entire organization.

#### **TRANSLATE: From Needs to Opportunities**

Coordinators translate organizational needs into clear, structured "Opportunities" within the app. A simple form allows them to specify:

* **The Task:** e.g., "Lead a tour at the National Museum."  
* **Required Skills:** Fluent in Japanese, Public Speaking.  
* **Date & Time:** Saturday, July 26th, 2 PM.  
* **Impact Statement:** "Help a delegation from Osaka understand Indonesian history."

#### **ENGAGE: AI-Powered Matchmaking**

This is the core of Tresno Boedoyo. When an opportunity is created, our AI engine instantly analyzes it against the entire volunteer database.

* **Intelligent Matching:** It identifies the top 3-5 volunteers whose skills, interests, and availability are a perfect match.  
* Personalized Notifications: Instead of a generic group message, these matched volunteers receive a targeted push notification: "Hi Kenji, an opportunity just opened to lead a Japanese-language tour at the National Museum this Saturday. We know you're a skilled guide. Interested?"  
  This hyper-personalization dramatically increases engagement and makes volunteers feel seen and valued.

#### **SUSTAIN: Recognition and Impact Tracking**

The platform is built for long-term sustainability and volunteer retention.

* **Impact Dashboard:** Every volunteer has a personal dashboard showcasing their contributions—hours volunteered, tours led, documents translated. This visual feedback loop reinforces the value of their work.  
* **Web3 Recognition (Soulbound Tokens):** For key milestones (e.g., 100 hours volunteered), the app automatically awards the volunteer a **"Proof of Contribution" Soulbound Token (SBT)**. This is a non-transferable digital certificate that lives permanently on the blockchain, acting as a modern, verifiable testament to their service that they can share on their CV or professional profiles.

### **4\. End-to-End Development Guide & Tech Stack**

This guide outlines a phased approach to building Tresno Boedoyo, making it achievable within a hackathon timeframe and beyond.

#### **Recommended Tech Stack**

* **Frontend (Mobile App):** **React Native**. Build once, deploy on both iOS and Android. This is efficient and perfect for a non-profit's budget.  
* **Backend (API):** **Node.js with Express**. Fast, scalable, and uses JavaScript, allowing your team to work with a single language across the stack.  
* **Database:** **PostgreSQL**. A robust, reliable relational database that's excellent for storing the structured data of user profiles and opportunities.  
* **AI Integration:** **Gemini API**. For the intelligent matchmaking feature.  
* **Web3 Integration:** **Polygon Blockchain** (for low fees) \+ **Thirdweb SDK** (to simplify NFT/SBT creation).  
* **Deployment:** **Heroku** (for the backend API) and **Expo Application Services (EAS)** (for building and deploying the React Native app).

#### **Phase 1: The MVP (Minimum Viable Product) \- The Core Foundation**

*Goal: Build the essential features for basic operation.*

1. **Setup:** Initialize a React Native project (using Expo), a Node.js/Express backend, and a PostgreSQL database.  
2. **User Authentication:** Implement sign-up and login functionality for both volunteers and coordinators (differentiate by roles).  
3. **Volunteer Profiles (Capture):** Create the UI and API endpoints for volunteers to create and edit their profiles. Focus on creating a structured way to add skills, interests, and availability (e.g., using tags).  
4. **Opportunity Board (Translate):** Build the feature for coordinators to create, view, update, and delete opportunities. Volunteers should be able to browse a list of all available opportunities.  
5. **Manual Application:** Allow volunteers to manually apply for an opportunity, and let coordinators approve or decline the application.

*At the end of this phase, you have a functional, albeit manual, volunteer management app.*

#### **Phase 2: The AI Matchmaker \- The "Magic"**

*Goal: Automate and enhance the matching process.*

1. **Backend Logic:** Create a new API endpoint, e.g., POST /api/opportunities/:id/match.  
2. **Craft the Prompt:** When this endpoint is called, the backend will gather the opportunity's required skills and details. It will then construct a detailed prompt for the Gemini API.  
   * **Example Prompt:** "You are an intelligent volunteer matching system. Here is a list of our available volunteers with their skills and interests in JSON format: \[ { "id": 1, "name": "Budi", "skills": \["public speaking", "english"\], ... } \]. An opportunity requires the following skills: \['public speaking', 'english'\]. Please return a JSON array containing the top 3 volunteer IDs that are the best match for this opportunity, ranked by relevance."  
3. **API Call:** The backend sends this prompt to the Gemini API.  
4. **Parse & Notify:** The backend receives the JSON response from Gemini, parses the ranked list of volunteer IDs, and triggers a personalized push notification to those specific users.

*At the end of this phase, the app can intelligently suggest the best volunteers for any task, saving coordinators hours of manual work.*

#### **Phase 3: The Web3 Recognition Layer**

*Goal: Implement the automated, blockchain-based reward system.*

1. **Smart Contract:** Use the Thirdweb SDK to easily create and deploy a Soulbound Token (SBT) smart contract on the Polygon testnet. This contract will define the "Proof of Contribution" token.  
2. **Backend Trigger:** In your backend, create a function that tracks volunteer contributions. When a volunteer reaches a predefined milestone (e.g., 50 hours), this function will trigger.  
3. **Minting the SBT:** The backend function will use the Thirdweb SDK to communicate with your smart contract on the blockchain. It will call the mint function to create a new SBT and award it to the volunteer's wallet address (which can be automatically generated and stored in their profile).  
4. **Frontend Display:** In the React Native app, add a "My Achievements" or "My Wallet" section to the volunteer's profile where they can view the SBTs they've earned.

*At the end of this phase, the app provides a modern, durable, and highly motivating form of recognition, strengthening the volunteer community for the long term.*

