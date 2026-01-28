import { useEffect, useState } from "react";
import { getPaste } from "../services/api";

const ViewPaste = () => {
  const shortId = window.location.pathname.split("/").pop()!;
  const [paste, setPaste] = useState<any>(null);

  useEffect(() => {
  let timeoutId: number | undefined;

  getPaste(shortId)
    .then((data) => {
      setPaste(data);

      // ⏱ Auto-redirect after expiry (if expires_at exists)
      if (data.expires_at) {
        const expiresAt = new Date(data.expires_at).getTime();
        const now = Date.now();
        const remainingMs = expiresAt - now;

        if (remainingMs <= 0) {
          // Already expired
          window.location.href = "/";
        } else {
          timeoutId = window.setTimeout(() => {
            window.location.href = "/";
          }, remainingMs);
        }
      }
    })
    .catch(() => {
      // If backend already says unavailable
      window.location.href = "/";
    });

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}, [shortId]);


  if (!paste) return <p>Loading...</p>;
  const handleCopy = () => {
  navigator.clipboard.writeText(window.location.href);
  alert("Link copied to clipboard!");
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #141e30, #243b55)",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont"
  },

  card: {
    width: "100%",
    maxWidth: "720px",
    background: "#ffffff",
    padding: "2.5rem",
    borderRadius: "14px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
    textAlign: "center"
  },

  title: {
    marginBottom: "1.5rem",
    color: "#222",
    fontSize: "28px"
  },

  content: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    background: "#f6f8fa",
    padding: "1.5rem",
    borderRadius: "10px",
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#111",
    border: "1px solid #e1e4e8",
    textAlign: "left",
    marginBottom: "1.5rem"
  },

  copyButton: {
    padding: "10px 18px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#243b55",
    background: "#eef2f7",
    border: "1px solid #d0d7de",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease"
  }
};


  return (
  <div style={styles.page}>
    <div style={styles.card}>
      <h1 style={styles.title}>Paste</h1>

      <pre style={styles.content}>
        {paste.content}
      </pre>

      <button onClick={handleCopy} style={styles.copyButton}>
        📋 Copy Link
      </button>
    </div>
  </div>
);

};

export default ViewPaste;
