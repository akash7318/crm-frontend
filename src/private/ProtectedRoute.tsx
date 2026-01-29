import { Navigate } from "react-router";
import { hasPermission } from "../utils/hasPermission";
import { useSelector } from "react-redux";
import { JSX } from "react";

type ProtectedRouteProps = {
	children: JSX.Element;
	permission?: string;
};

const ProtectedRoute = ({ children, permission }: ProtectedRouteProps) => {
	const user = useSelector((state: any) => state.auth.user);

	// Permission check
	const initialized = useSelector((state: any) => state.auth.initialized);

	// Wait until auth initialization (checkIsLoggedIn) finishes
	if (!initialized) {
		return null;
	}

	const userPermissions = user?.designation?.permissions;

	if (!hasPermission(userPermissions, permission)) {
		return <Navigate to="/forbidden" replace />;
	}

	// Access granted
	return children;
};

export default ProtectedRoute;
