import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import PageMeta from "../common/PageMeta";
import AuthLayout from "../../pages/AuthPages/AuthPageLayout";
import Button from "../ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
	changePasswordByEmailAndOTP as changePassword,
	sendResetPasswordOTP,
	verifyOTP,
} from "../../features/auth/authSlice";
import { useState } from "react";
import ResendOtp from "../otp/ResendOtp";

export default function ResetPassword() {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState<number | null>(null);
	const [showOTPForm, setShowOTPForm] = useState(false);
	const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
	const [mismatchError, setMismatchError] = useState(false);
	const loading = useSelector((state: any) => state.auth.loading);
	const error = useSelector((state: any) => state.auth.error);
	const message = useSelector((state: any) => state.auth.message);
	const dispatch = useDispatch<AppDispatch>();

	// Send OTP Handler
	const submitHandler = async (e: React.FormEvent) => {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const email = (formData.get("email") as string | null)?.trim() ?? "";
		setEmail(email);

		try {
			const resultAction = await dispatch(
				sendResetPasswordOTP({ email })
			);
			if (!resultAction?.payload?.data) {
				throw new Error("Failed to send OTP");
			}
			setShowOTPForm(true);
		} catch (error) {
			console.error("OTP sent failed:", error);
		}
	};

	// OTP Verification Handler
	const submitOTPHandler = async (e: React.FormEvent) => {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const otp = Number(
			(formData.get("otp") as string | null)?.trim() ?? ""
		);
		setOtp(otp);

		try {
			const resultAction = await dispatch(verifyOTP({ email, otp }));
			if (!resultAction?.payload?.data) {
				throw new Error("Failed to verify OTP");
			}
			setShowChangePasswordForm(true);
		} catch (error) {
			console.error("Verify OTP failed:", error);
		}
	};

	// Change Password Handler
	const submitChangePasswordHandler = async (e: React.FormEvent) => {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const password =
			(formData.get("password") as string | null)?.trim() ?? "";
		const confirmPassword =
			(formData.get("confirmPassword") as string | null)?.trim() ?? "";
		if (password !== confirmPassword) {
			setMismatchError(true);
			console.error("Passwords do not match");
			return;
		}

		try {
			const resultAction = await dispatch(
				changePassword({ email, password, otp })
			);
			if (!resultAction?.payload?.data) {
				throw new Error("Failed to change password");
			}
			// Redirect to login page after successful password change
			navigate("/");
		} catch (error) {
			console.error("Change password failed:", error);
		}
	};

	return (
		<>
			<PageMeta
				title="Reset Password"
				description="Reset your account password"
			/>
			<AuthLayout message="Reset your password by entering your email address.">
				<div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
					<div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
						<Link
							to="/"
							className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
						>
							<ChevronLeftIcon className="size-5" />
							Go Back!
						</Link>
					</div>
					<div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
						<div>
							<div className="mb-5 sm:mb-8">
								<h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
									Reset Password
								</h1>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Enter your email to send OTP
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
								<form
									onSubmit={submitHandler}
									className={!showOTPForm ? "" : "hidden"}
								>
									<div className="space-y-5">
										{/* <!-- Email --> */}
										<div>
											<Label htmlFor="email">
												Email
												<span className="text-error-500">
													*
												</span>
											</Label>
											<Input
												type="email"
												id="email"
												name="email"
												placeholder="Enter your email"
												required={true}
												autofocus={true}
											/>
										</div>
										{/* <!-- Button --> */}
										<div>
											<Button
												type="submit"
												className="w-full"
												size="sm"
												disabled={loading}
											>
												{loading ? (
													<>
														Sending OTP...
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
													"Send OTP"
												)}
											</Button>
										</div>
									</div>
								</form>

								{/* OTP Form */}
								<form
									onSubmit={submitOTPHandler}
									className={
										showOTPForm && !showChangePasswordForm
											? ""
											: "hidden"
									}
								>
									<div className="space-y-5">
										{/* <!-- OTP --> */}
										<div>
											<div className="flex justify-between">
												<Label htmlFor="otp">
													OTP
													<span className="text-error-500">
														*
													</span>
												</Label>

												{/* Resend OTP */}
												<ResendOtp
													email={email}
													otpType="EMAIL"
												/>
											</div>
											<Input
												type="number"
												id="otp"
												name="otp"
												placeholder="Enter OTP"
												required={true}
												className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
											/>
										</div>
										{/* <!-- Button --> */}
										<div>
											<Button
												type="submit"
												className="w-full"
												size="sm"
												disabled={loading}
											>
												{loading ? (
													<>
														Verifying OTP...
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
													"Verify OTP"
												)}
											</Button>
										</div>
									</div>
								</form>

								{/* Change Password Form */}
								<form
									onSubmit={submitChangePasswordHandler}
									className={
										showChangePasswordForm ? "" : "hidden"
									}
								>
									<div className="space-y-5">
										{/* <!-- New Password --> */}
										<div>
											<Label htmlFor="newPassword">
												New Password
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
													id="newPassword"
													placeholder="Enter your new password"
													required={true}
												/>
												<span
													onClick={() =>
														setShowPassword(
															!showPassword
														)
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
										{/* <!-- Confirm New Password --> */}
										<div>
											<Label htmlFor="confirmPassword">
												Confirm New Password
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
													name="confirmPassword"
													id="confirmPassword"
													placeholder="Enter your confirm password"
													required={true}
												/>
												<span
													onClick={() =>
														setShowPassword(
															!showPassword
														)
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
											{mismatchError && (
												<p className="text-sm text-red-500 mt-1">
													Passwords do not match.
												</p>
											)}
										</div>
										{/* <!-- Button --> */}
										<div>
											<Button
												type="submit"
												className="w-full"
												size="sm"
												disabled={loading}
											>
												{loading ? (
													<>
														Updating Password...
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
													"Update Password"
												)}
											</Button>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</AuthLayout>
		</>
	);
}
