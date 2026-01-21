import React from "react";
import GridShape from "../../components/common/GridShape";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
	message,
	children,
}: {
	children: React.ReactNode;
	message: React.ReactNode;
}) {
	return (
		<div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
			<div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
				{children}
				<div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
					<div className="relative flex items-center justify-center z-1">
						{/* <!-- ===== Common Grid Shape Start ===== --> */}
						<GridShape />
						<div className="flex flex-col items-center max-w-xl">
							<img
								width={150}
								// height={48}
								src="/images/logo/logo-insta.png"
								alt="Logo"
								className="bg-white p-2 rounded-md mb-4 dark:bg-gray-300"
							/>
							<p className="text-center text-gray-400 dark:text-white/60">
								{message ||
									"Login to your account to access all the features of the dashboard."}
							</p>
							<p className="text-center text-gray-400 dark:text-white/60">
								Stay connected and manage your preferences with
								ease.
							</p>
						</div>
					</div>
				</div>
				<div className="fixed z-50 hidden bottom-6 right-6 sm:block">
					<ThemeTogglerTwo />
				</div>
			</div>
		</div>
	);
}
