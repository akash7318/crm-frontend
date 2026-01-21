import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import PrivateRoute from "./private/PrivateRoute";
import Permissions from "./pages/Settings/Permissions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkIsLoggedIn } from "./features/auth/authSlice";
import type { AppDispatch } from "./app/store";
import EmployeeData from "./pages/Employees/EmployeeData";
import ResetPassword from "./components/auth/ResetPassword";

export default function App() {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(checkIsLoggedIn()).unwrap();
		return () => {};
	}, [dispatch]);

	const user = useSelector((state: any) => state.auth.user);

	return (
		<>
			<Router>
				<ScrollToTop />
				<Routes>
					{/* Auth Layout */}
					<Route index path="/" element={<SignIn />} />

					{/* Dashboard Layout */}
					<Route element={<PrivateRoute />}>
						<Route element={<AppLayout />}>
							<Route path="/dashboard" element={<Home />} />

							{/* Others Page */}
							<Route path="/profile" element={<UserProfiles />} />
							<Route path="/calendar" element={<Calendar />} />
							<Route path="/blank" element={<Blank />} />

							{/* Employee */}
							<Route path="/employees">
								<Route path="" element={<SignUp />} />
								<Route path="add" element={<EmployeeData />} />
							</Route>

							{/* Permissions */}
							{user?.isAdmin && (
								<Route
									path="/permissions"
									element={<Permissions />}
								/>
							)}

							{/* Forms */}
							<Route
								path="/form-elements"
								element={<FormElements />}
							/>

							{/* Tables */}
							<Route
								path="/basic-tables"
								element={<BasicTables />}
							/>

							{/* Ui Elements */}
							<Route path="/alerts" element={<Alerts />} />
							<Route path="/avatars" element={<Avatars />} />
							<Route path="/badge" element={<Badges />} />
							<Route path="/buttons" element={<Buttons />} />
							<Route path="/images" element={<Images />} />
							<Route path="/videos" element={<Videos />} />

							{/* Charts */}
							<Route path="/line-chart" element={<LineChart />} />
							<Route path="/bar-chart" element={<BarChart />} />
						</Route>
					</Route>

					{/* Auth Layout */}
					<Route path="/signup" element={<SignUp />} />

					{/* Auth Layout */}
					<Route path="/reset-password" element={<ResetPassword />} />

					{/* Fallback Route */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</>
	);
}
