// ProtectedRoute.js
import { withAuthenticator } from '@aws-amplify/ui-react';

function ProtectedRoute({ children }) {
    return children;
}

export default withAuthenticator(ProtectedRoute);
