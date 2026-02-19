import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import { useEffect, useState } from "react";
import {
	DocsIcon,
	EnvelopeIcon,
	EyeCloseIcon,
	EyeIcon,
	LockIcon,
	UserIcon,
} from "../../icons";
import DatePicker from "../../components/form/date-picker";
import PhoneInput from "../../components/form/group-input/PhoneInput";
import Button from "../../components/ui/button/Button";
import axios from "../../config/axios";
import Alert from "../../components/ui/alert/Alert";

export default function EmployeeData() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [designations, setDesignations] = useState<
		{ value: string; label: string }[]
	>([]);
	const [teams, setTeams] = useState<{ value: string; label: string }[]>([]);
	const [isTeamSelectionResuired, setIsTeamSelectionResuired] =
		useState(true);

	const countries = [{ code: "IN", label: "+91" }];

	const handleSelectChange = (value: string) => {
		setIsTeamSelectionResuired(true);
		designations.map((item) => {
			if (item.value === value && item.label === "Manager") {
				setIsTeamSelectionResuired(false);
			}
		});
	};

	const handleTeamSelectChange = () => {};

	const submitHandler = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());

		setMessage("");
		setError("");

		await axios
			.post("/users/create", data)
			.then((res) => {
				form.reset();
				setMessage(res?.data?.message);
				setLoading(false);
			})
			.catch((err) => {
				setError(err?.response?.data?.message);
				setLoading(false);
				console.log(err);
			});
		getTeamDesignations();
	};

	async function getTeamDesignations() {
		const result = await axios.get("/designations");
		if (!result?.data?.data) {
			console.error(result);
			return;
		}

		const resDesignations = result?.data?.data?.map(
			(item: { _id: string; name: string }) => ({
				value: item._id,
				label: item.name,
			})
		);
		setDesignations(resDesignations);

		const resultFetchAssignableLeaders = await axios.get(
			"/designations/fetchAssignableLeaders"
		);
		if (!resultFetchAssignableLeaders?.data?.data) {
			console.error(resultFetchAssignableLeaders);
			return;
		}

		const fetchAssignableLeaders =
			resultFetchAssignableLeaders?.data?.data?.map(
				(item: { _id: string; name: string }) => ({
					value: item._id,
					label: item.name,
				})
			);

		setTeams(fetchAssignableLeaders);
	}

	useEffect(() => {
		getTeamDesignations();
	}, []);

	return (
		<>
			<PageMeta title="Create a new employee account" description="" />
			<PageBreadcrumb pageTitle="Create Employee Account" />
			<div className="grid grid-cols-1 gap-6">
				<div className="space-y-6">
					<ComponentCard title="Employee Information">
						{message && (
							<div className="space-y-5 sm:space-y-6">
								<Alert
									variant="success"
									title="Employee Registration Successful"
									message="An email containing login credentials has been sent to the employee, allowing access to the CRM dashboard."
									showLink={false}
								/>
							</div>
						)}
						{error && (
							<div className="space-y-5 sm:space-y-6">
								<Alert
									variant="error"
									title="Employee Registration Failed"
									message={error}
									showLink={false}
								/>
							</div>
						)}
						<form onSubmit={submitHandler}>
							<div className="grid grid-cols-1 gap-4 space-y-6 md:grid-cols-2">
								<div>
									<Label htmlFor="name">Name*</Label>
									<div className="relative">
										<Input
											type="text"
											id="name"
											name="name"
											className="pl-[62px]"
											placeholder="Enter full name"
											autofocus={true}
											required={true}
										/>
										<span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
											<UserIcon className="size-6" />
										</span>
									</div>
								</div>
								<div>
									<Label htmlFor="email">Email*</Label>
									<div className="relative">
										<Input
											type="email"
											id="email"
											name="primaryEmail"
											className="pl-[62px]"
											placeholder="Enter email"
											required={true}
										/>
										<span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
											<EnvelopeIcon className="size-6" />
										</span>
									</div>
								</div>
								<div>
									<Label htmlFor="phone">Phone*</Label>
									<PhoneInput
										type="number"
										id="phone"
										name="primaryPhone"
										selectPosition="start"
										countries={countries}
										placeholder="00000 00000"
										required={true}
									/>
								</div>
								<div>
									<Label htmlFor="designation">
										Designation*
									</Label>
									<Select
										options={designations}
										id="designation"
										name="designationId"
										placeholder="Select a designation"
										onChange={handleSelectChange}
										className="dark:bg-dark-900"
										required={true}
									/>
								</div>
								<div>
									<Label htmlFor="password">Password*</Label>
									<div className="relative">
										<Input
											type={
												showPassword
													? "text"
													: "password"
											}
											className="pl-[62px]"
											id="password"
											name="password"
											placeholder="Enter password"
											required={true}
										/>
										<span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
											<LockIcon className="size-6" />
										</span>
										<button
											type="button"
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
										</button>
									</div>
								</div>

								<div>
									<Label htmlFor="teams">
										Teams
										{isTeamSelectionResuired ? "*" : ""}
									</Label>
									<Select
										options={teams}
										name="teamHeadId"
										id="teams"
										placeholder="Select a team"
										onChange={handleTeamSelectChange}
										className="dark:bg-dark-900"
										required={
											isTeamSelectionResuired ?? false
										}
									/>
								</div>

								<div>
									<DatePicker
										id="date-picker"
										name="joiningDate"
										label="Joining Date"
										placeholder="Select a date"
										onChange={(
											dates,
											currentDateString
										) => {
											// Handle your logic
											console.log({
												dates,
												currentDateString,
											});
										}}
									/>
								</div>
							</div>
							<div className="flex items-center gap-5 mt-6">
								<Button
									type="submit"
									size="sm"
									variant="primary"
									startIcon={<DocsIcon className="size-5" />}
									disabled={loading}
								>
									{loading ? (
										<>
											Saving...
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
										"Save"
									)}
								</Button>
							</div>
						</form>
					</ComponentCard>
				</div>
			</div>
		</>
	);
}
