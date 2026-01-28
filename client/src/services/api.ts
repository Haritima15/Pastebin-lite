const API_BASE = "http://localhost:5000/api";

export const createPaste = async (content: string) => {
  const res = await fetch(`${API_BASE}/paste`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ content })
  });

  if (!res.ok) {
    throw new Error("Failed to create paste");
  }

  return res.json();
};

export const getPaste = async (shortId: string) => {
  const res = await fetch(`${API_BASE}/paste/${shortId}`);

  if (!res.ok) {
    throw new Error("Paste not found");
  }

  return res.json();
};
