import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Redirect() {
  const { slug } = useParams();

  useEffect(() => {
    const lookupAndRedirect = async () => {
      // OPTIONAL: real lookup logic based on `slug` (e.g., cached from Lambda)
      const knownRedirects = {
        'rosie': 'https://www.petfinder.com/dog/rosie-123456789',
        'mister-snuffleupagus': 'https://www.petfinder.com/cat/mister-snuffleupagus-987654321',
      };

      const redirectUrl = knownRedirects[slug] || 'https://www.littlepawsplace.com';
      window.location.href = redirectUrl;
    };

    lookupAndRedirect();
  }, [slug]);

  return <p>Redirecting you to the adoption page…</p>;
}
