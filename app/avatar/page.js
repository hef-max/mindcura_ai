'use client'
import * as React from "react"
import Layout from "@/components/layouts/Layouts";
import App from "@/public/App";
import ReactDOM from 'react-dom/client';
import { ChatProvider } from "@/hooks/useChat";

let root;

export default function Avatar() {
    React.useEffect(() => {
        const rootElement = document.getElementById('root');
        if (rootElement) {
          if (!root) { 
            root = ReactDOM.createRoot(rootElement);
          }
          root.render(
            <React.StrictMode>
              <ChatProvider>
                <App />
              </ChatProvider>
            </React.StrictMode>
          );
        }
      }, []);

    return (
        <Layout>
            <div id="root"></div>
        </Layout>
    );
}
