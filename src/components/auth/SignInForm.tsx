import { useEffect, useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import { Link, useNavigate } from "react-router";
import type { AppDispatch } from "../../app/store";

export default function SignInForm() {
	const [showPassword, setShowPassword] = useState(false);
	// Replace the existing loading state with direct selector
	const loading = useSelector((state: any) => state.auth.loading);
	const error = useSelector((state: any) => state.auth.error);
	const message = useSelector((state: any) => state.auth.message);
	const dispatch = useDispatch<AppDispatch>();

	const navigate = useNavigate();
	const user = useSelector((state: any) => state.auth.user);

	useEffect(() => {
		if (user !== null) {
			navigate("/dashboard");
		}
	}, [user, navigate]);

	const submitHandler = async (e: React.FormEvent) => {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const email = (formData.get("email") as string | null)?.trim() ?? "";
		const password =
			(formData.get("password") as string | null)?.trim() ?? "";
		try {
			const resultAction = await dispatch(loginUser({ email, password }));
			if (loginUser.fulfilled.match(resultAction)) {
				// Login was successful
				navigate("/dashboard");
			}
		} catch (error) {
			console.error("Login failed:", error);
		}
	};
	return (
		<div className="flex flex-col flex-1">
			<div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
				<div>
					<div className="mb-5 sm:mb-8">
						<h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
							Sign In
						</h1>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Enter your email and password to sign in!
						</p>
					</div>
					<div>
						{error && (
							<p className="text-center text-red-500 bg-red-200 rounded-md border-l-4 border-l-red-400 border-r-4 border-r-red-400 py-1 mb-2">
								{error}
							</p>
						)}
						{message && (
							<p className="text-center text-green-500 bg-green-200 rounded-md border-l-4 border-l-green-400 border-r-4 border-r-green-400 py-1 mb-2">
								{message}
							</p>
						)}
						<form onSubmit={submitHandler}>
							<div className="space-y-6">
								<div>
									<Label>
										Email{" "}
										<span className="text-error-500">
											*
										</span>
									</Label>
									<Input
										type="email"
										name="email"
										placeholder="info@gmail.com"
										required={true}
										autofocus={true}
									/>
								</div>
								<div>
									<Label>
										Password{" "}
										<span className="text-error-500">
											*
										</span>
									</Label>
									<div className="relative">
										<Input
											type={
												showPassword
													? "text"
													: "password"
											}
											name="password"
											placeholder="Enter your password"
											required={true}
										/>
										<span
											onClick={() =>
												setShowPassword(!showPassword)
											}
											className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
										>
											{showPassword ? (
												<EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
											) : (
												<EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
											)}
										</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<Link
										to="/reset-password"
										className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
									>
										Forgot password?
									</Link>
								</div>
								<div>
									<Button
										type="submit"
										className="w-full"
										size="sm"
										disabled={loading}
									>
										{loading ? (
											<>
												Signing in...
												<svg
													className="w-5 h-5 ml-3 animate-spin text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													></path>
												</svg>
											</>
										) : (
											"Sign in"
										)}
									</Button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
