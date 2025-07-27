import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Redirect() {
  const { slug } = useParams();

useEffect(() => {
  const fetchRedirect = async () => {
    try {
      const res = await fetch(`https://littlepawsplace-redirects.s3.amazonaws.com/redirects/${slug}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log("✅ Redirecting to:", data.url);
      window.location.href = data.url || 'https://www.littlepawsplace.com';
    } catch (err) {
      console.error("❌ Failed to redirect:", err);
      window.location.href = 'https://www.littlepawsplace.com';
    }
  };

  fetchRedirect();
}, [slug]);



  return <p>Redirecting you to the adoption page…</p>;
}
