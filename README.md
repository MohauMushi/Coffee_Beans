# Coffee&Beans

Coffee&Beans is a web application that offers a curated selection of premium coffee beans from around the world. Built with Next.js and integrated with Firebase for authentication and database management, this platform provides coffee enthusiasts with a seamless experience to explore and purchase high-quality coffee beans.

## **Live Demo Website**

🌐 [coffee & beans](https://coffee-and-beans.vercel.app/)

## Features

- Curated selection of premium coffee beans
- User authentication via Firebase
- Real-time database powered by Firebase
- Responsive design for optimal viewing on all devices
- Built with Next.js for improved performance and SEO

## Technologies Used

- **Next.js**: A React framework for production-grade applications with server-side rendering and routing capabilities.
- **React**: A JavaScript library for building user interfaces.
- **JavaScript**: The primary programming language used for both front-end and back-end logic.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom user interfaces.
- **next/image**: Next.js's built-in Image component for optimized image loading and rendering.
- **Firebase**: A platform for building web and mobile applications, providing authentication, database, and hosting services.
- **Firestore**: A flexible, scalable NoSQL cloud database to store and sync data.
- **Firebase Authentication**: For user sign-up, sign-in, and session management.
- **Vercel**: For deployment and hosting of the Next.js application.

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm
- Firebase account

### Installation

1. **Clone the repository**

   ```
   git clone https://github.com/MohauMushi/Coffee_Beans.git
   ```

2. **Navigate to the project directory**

   ```
   cd coffee_beans
   ```

3. **Install dependencies**

   ```
   npm install
   ```

4. **Set up your Firebase configuration**

   - Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/)
   - Add a web app to your Firebase project
   - Copy the Firebase configuration object
   - Create a `.env` file in the root of your project and add your Firebase configuration:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```

5. **Run the development server**

   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Contributing

We welcome contributions to Coffee&Beans! Please feel free to submit issues, fork the repository and send pull requests!

## Acknowledgments

- Thanks to (Arvid Gärdebo,
  Joel Holsner,
  Josef Abdo) for the api - https://fake-coffee-api.vercel.app/
- Thanks to all the coffee farmers and roasters who provide us with amazing beans
