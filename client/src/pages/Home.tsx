import { useState } from "react";
import { createPaste } from "../services/api";

const Home = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [maxViews, setMaxViews] = useState<number | "">("");
  const [ttlSeconds, setTtlSeconds] = useState<number | "">("");


  const handleCreate = async () => {
  try {
    setLoading(true);

    const options: any = {};
    if (maxViews !== "") options.max_views = maxViews;
    if (ttlSeconds !== "") options.ttl_seconds = ttlSeconds;

    const res = await createPaste(content, options);
    window.location.href = `/${res.id}`;
  } catch {
    alert("Failed to create paste");
  } finally {
    setLoading(false);
  }
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont"
  },

  card: {
    width: "100%",
    maxWidth: "600px",
    background: "#ffffff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
  },

  title: {
    marginBottom: "1rem",
    textAlign: "center",
    color: "#333"
  },

  textarea: {
    width: "100%",
    minHeight: "180px",
    resize: "vertical",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    marginBottom: "1rem"
  },

  row: {
    display: "flex",
    gap: "12px",
    marginBottom: "1.5rem"
  },

  input: {
    flex: 1,
    padding: "10px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none"
  },

  button: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    fontWeight: 600,
    color: "#fff",
    background: "#2c5364",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 0.2s"
  }
};


  return (
  <div style={styles.page}>
    <div style={styles.card}>
      <h1 style={styles.title}>Create a Paste</h1>

      <textarea
        placeholder="Write your paste here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={styles.textarea}
      />

      <div style={styles.row}>
        <input
          type="number"
          min={1}
          placeholder="Max Views"
          value={maxViews}
          onChange={(e) =>
            setMaxViews(e.target.value === "" ? "" : Number(e.target.value))
          }
          style={styles.input}
        />

        <input
          type="number"
          min={1}
          placeholder="TTL (seconds)"
          value={ttlSeconds}
          onChange={(e) =>
            setTtlSeconds(e.target.value === "" ? "" : Number(e.target.value))
          }
          style={styles.input}
        />
      </div>

      <button
        onClick={handleCreate}
        disabled={loading || !content.trim()}
        style={{
          ...styles.button,
          opacity: loading || !content.trim() ? 0.6 : 1
        }}
      >
        {loading ? "Creating..." : "Create Paste"}
      </button>
    </div>
  </div>
);

};

export default Home;
