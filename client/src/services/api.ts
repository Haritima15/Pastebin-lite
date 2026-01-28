const API_BASE = import.meta.env.VITE_API_BASE;


export const createPaste = async (
  content: string,
  options?: { max_views?: number; ttl_seconds?: number }
) => {
  const res = await fetch(`${API_BASE}/pastes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content,
      ...options
    })
  });

  if (!res.ok) {
    throw new Error("Failed to create paste");
  }

  return res.json();
};


export const getPaste = async (id: string) => {
  const res = await fetch(`${API_BASE}/pastes/${id}`);

  if (!res.ok) {
    throw new Error("Paste not found");
  }

  return res.json();
};
