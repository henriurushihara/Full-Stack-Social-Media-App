# Wavegram: Full Stack Social Media Platform

Wavegram is a social media application that fosters collaboration and community building. 
This project is built with React.js, TypeScript, Appwrite, and Tailwind CSS.

## Getting Started

### Prerequisites

1. **Node.js and npm**: Install [Node.js](https://nodejs.org/) (which includes npm).
2. **Appwrite Account**: [Sign up for Appwrite for free using this link](https://apwr.dev/JSMastery) and create a project.

### Setting Up the Project

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install Dependencies:**
   Install the required dependencies for the project using the `package.json` file:
   ```bash
   npm install
   ```

   Dependencies included in the project:
   - **@hookform/resolvers**: Form validation resolvers.
   - **@radix-ui/react-label**, **@radix-ui/react-slot**, **@radix-ui/react-toast**: Radix UI components for accessibility and UI features.
   - **@tanstack/react-query**: For state and server-side data management.
   - **appwrite**: Appwrite SDK for backend integration.
   - **class-variance-authority** and **clsx**: Utility libraries for managing class names.
   - **lucide-react**: Icon library for React.
   - **react** and **react-dom**: Core React libraries.
   - **react-dropzone**: For file uploads via drag-and-drop.
   - **react-hook-form**: For form handling.
   - **react-intersection-observer**: For detecting when elements are visible.
   - **react-router-dom**: For routing functionality.
   - **tailwind-merge**: For managing Tailwind CSS classes.
   - **zod**: For schema validation.

   Dev dependencies included:
   - **vite**: Build tool for development.
   - **tailwindcss**, **autoprefixer**, and **postcss**: For styling.
   - **typescript**, **@types/react**, and **@vitejs/plugin-react**: For TypeScript support.
   - **eslint** and related plugins: For linting.

3. **Set Up Appwrite:**
   - Create a new project in your Appwrite dashboard.
   - Set up the following collections and IDs:
     - Storage ID
     - Database ID
     - Saves Collection ID
     - Post Collection ID
     - User Collection ID
     - Followers Collection ID
   
   Refer to the [Appwrite Documentation](https://appwrite.io/docs) for more details on setting up collections.

4. **Create a `.env.local` File:**
   - In the project root directory, create a `.env.local` file.
   - Replace the placeholders with your Appwrite credentials:
     ```env
     VITE_APPWRITE_PROJECT_ID='your_project_id'
     VITE_APPWRITE_URL='your_appwrite_url'
     VITE_APPWRITE_STORAGE_ID='your_storage_id'
     VITE_APPWRITE_DATABASE_ID='your_database_id'
     VITE_APPWRITE_SAVES_COLLECTION_ID='your_saves_collection_id'
     VITE_APPWRITE_POST_COLLECTION_ID='your_post_collection_id'
     VITE_APPWRITE_USER_COLLECTION_ID='your_user_collection_id'
     VITE_APPWRITE_FOLLOWERS_COLLECTION_ID='your_followers_collection_id'
     ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

## Features

- **User Authentication (Login/Sign Up)**
- **Post Creation and Interaction (Like/Save Posts)**
- **Follow/Unfollow Functionality**

## Technologies Used

- React.js
- TypeScript
- Appwrite
- Tailwind CSS

## Referencing Dependencies

To install all dependencies listed in the `package.json` file, simply run:
```bash
npm install
```
This will ensure that all required libraries and tools are set up for your project.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International Public License. 
See the LICENSE file for details.
