import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkIsLoggedIn } from "../features/auth/authSlice";
import type { AppDispatch } from "../app/store";
// import FullPageLoader from "../components/ui/loader/FullPageLoader";

function PrivateRoute() {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	// const initialized = useSelector((state: any) => state.auth.initialized);

	useEffect(() => {
		(async () => {
			try {
				if (!(await dispatch(checkIsLoggedIn()).unwrap())) {
					navigate("/");
				}
			} catch (error) {
				console.error("Session Expired!", error);
				navigate("/");
			}
		})();
	}, [dispatch, navigate]);

	// if (!initialized) {
	// 	return <FullPageLoader />;
	// }
	return <Outlet />;
}

export default PrivateRoute;
