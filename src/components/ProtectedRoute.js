// ProtectedRoute.js
import { withAuthenticator } from '@aws-amplify/ui-react';

function ProtectedRoute({ children }) {
    console.log("ProtectedRoute rendered ");
    return children;
}

export default withAuthenticator(ProtectedRoute);
