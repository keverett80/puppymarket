import React, { useEffect, useState } from 'react';

export default function InstagramCallback() {
  const [code, setCode] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const authCode = query.get("code");
    setCode(authCode);
  }, []);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Instagram Authorization Complete</h1>
      <p>Auth Code:</p>
      <code>{code || "No code found."}</code>
    </div>
  );
}
