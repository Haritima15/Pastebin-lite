import { useEffect, useState } from "react";
import { getPaste } from "../services/api";

const ViewPaste = () => {
  const shortId = window.location.pathname.split("/").pop()!;
  const [paste, setPaste] = useState<any>(null);

  useEffect(() => {
    getPaste(shortId)
      .then(setPaste)
      .catch(() => alert("Paste not found"));
  }, [shortId]);

  if (!paste) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Paste</h2>

      <pre>{paste.content}</pre>

      <p>👀 Views: {paste.views}</p>
      <p>🕒 Created at: {new Date(paste.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default ViewPaste;
