import React from "react";
import { useDispatch } from "react-redux";
import { useTimer } from "react-timer-hook";
import { AppDispatch } from "../../app/store";
import { sendResetPasswordOTP } from "../../features/auth/authSlice";

interface ResendOtpProps {
	email?: string;
	phone?: string;
	userId?: string;
	otpType: "EMAIL" | "SMS" | "LOGIN";
}

const RESEND_DURATION = 120; // 2 minutes

const ResendOtp: React.FC<ResendOtpProps> = ({
	email,
	phone,
	userId,
	otpType,
}) => {
	const dispatch = useDispatch<AppDispatch>();
	const expiryTime = new Date();
	expiryTime.setSeconds(expiryTime.getSeconds() + RESEND_DURATION);

	const { seconds, minutes, isRunning, restart } = useTimer({
		expiryTimestamp: expiryTime,
		autoStart: true,
	});

	const handleResendOtp = async (): Promise<void> => {
		// ✅ Strongly typed props
		console.log("Resend OTP payload:", {
			email,
			phone,
			userId,
			otpType,
		});

		if (!email) {
			throw new Error("Email is required to resend OTP");
		}
		const resultAction = await dispatch(sendResetPasswordOTP({ email }));
		if (!resultAction?.payload?.data) {
			throw new Error("Failed to send OTP");
		}

		const newExpiry = new Date();
		newExpiry.setSeconds(newExpiry.getSeconds() + RESEND_DURATION);
		restart(newExpiry, true);
	};

	return (
		<button
			type="button"
			onClick={handleResendOtp}
			disabled={isRunning}
			className="text-sm text-gray-500 dark:text-gray-400 italic"
		>
			{isRunning
				? `Resend OTP in: ${minutes}:${seconds.toString().padStart(2, "0")}`
				: "Resend OTP!"}
		</button>
	);
};

export default ResendOtp;
