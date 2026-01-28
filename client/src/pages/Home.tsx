import { useState } from "react";
import { createPaste } from "../services/api";

const Home = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      const res = await createPaste(content);
      window.location.href = `/paste/${res.shortId}`;
    } catch (err) {
      alert("Failed to create paste");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create a Paste</h2>

      <textarea
        rows={10}
        style={{ width: "100%" }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <br /><br />

      <button onClick={handleCreate} disabled={loading}>
        {loading ? "Creating..." : "Create Paste"}
      </button>
    </div>
  );
};

export default Home;
