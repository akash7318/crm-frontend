export default function FullPageLoader() {
	return (
		<>
			<div
				className="fixed inset-0 z-50 flex items-center justify-center 
                bg-gradient-to-br 
                from-white via-gray-50 to-gray-100
                dark:from-gray-950 dark:via-gray-900 dark:to-gray-950
                transition-colors duration-300"
			>
				<div className="flex flex-col items-center space-y-8">
					{/* Premium Ring Loader */}
					<div className="relative h-20 w-20">
						{/* Outer subtle ring */}
						<div
							className="absolute inset-0 rounded-full border-4 
                      border-gray-200 dark:border-gray-800"
						></div>

						{/* Animated brand ring */}
						<div
							className="absolute inset-0 rounded-full border-4 border-transparent 
                      border-t-blue-600 border-r-red-500 
                      animate-spin"
						></div>

						{/* Inner soft core */}
						<div
							className="absolute inset-3 rounded-full 
                      bg-white dark:bg-gray-900 shadow-inner"
						></div>
					</div>

					{/* Universal CRM Text */}
					<div className="text-center space-y-2">
						<h2
							className="text-lg font-semibold tracking-wide 
                     text-gray-800 dark:text-gray-200"
						>
							Loading
						</h2>

						<div
							className="h-1 w-12 mx-auto rounded-full 
                      bg-gradient-to-r from-blue-600 to-red-500"
						></div>

						<p className="text-sm text-gray-500 dark:text-gray-400">
							Please wait while we prepare your workspace...
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
