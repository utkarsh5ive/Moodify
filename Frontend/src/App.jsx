import React from "react";
import { RouterProvider } from "react-router";
import {router} from "./app.routes.jsx"
import "../src/features/shared/styles/global.scss"
import { AuthProvider } from "./features/auth/auth.context.jsx";


import { Toaster } from "react-hot-toast";

function App() {
  return (
      <AuthProvider>
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#1e1e1e',
              color: '#fff',
              border: '1px solid #333'
            }
          }} 
        />
        <RouterProvider router={router} />
      </AuthProvider>
  );
}

export default App;