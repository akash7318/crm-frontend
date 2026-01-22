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

export default function EmployeeData() {
	const [showPassword, setShowPassword] = useState(false);
	const [designations, setDesignations] = useState([]);
	const [isTeamSelectionResuired, setIsTeamSelectionResuired] =
		useState(true);

	const teams = [
		{ value: "Floor Manager", label: "Floor Manager" },
		{ value: "Manager", label: "Manager" },
		{ value: "Team Leader", label: "Team Leader" },
		{ value: "Executive", label: "Executive" },
	];
	const countries = [{ code: "IN", label: "+91" }];
	const handlePhoneNumberChange = (phoneNumber: string) => {
		console.log("Updated phone number:", phoneNumber);
	};

	const handleSelectChange = (value: string) => {
		setIsTeamSelectionResuired(true);
		// Id of Floor Manager
		if (value === "69713c6ad1dfd8cfc7d5cc77") {
			setIsTeamSelectionResuired(false);
		}
		console.log("Selected value:", value);
	};

	useEffect(() => {
		(async () => {
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
		})();
	}, []);

	return (
		<>
			<PageMeta title="Create a new employee account" description="" />
			<PageBreadcrumb pageTitle="Create Employee Account" />
			<div className="grid grid-cols-1 gap-6">
				<div className="space-y-6">
					<ComponentCard title="Employee Information">
						<form action="">
							<div className="grid grid-cols-1 gap-4 space-y-6 md:grid-cols-2">
								<div>
									<Label htmlFor="name">Name*</Label>
									<div className="relative">
										<Input
											type="text"
											id="name"
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
									<Label htmlFor="email">
										Primary Email*
									</Label>
									<div className="relative">
										<Input
											type="email"
											id="email"
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
									<Label htmlFor="phone">
										Primary Phone*
									</Label>
									<PhoneInput
										type="number"
										id="phone"
										selectPosition="start"
										countries={countries}
										placeholder="00000 00000"
										required={true}
										onChange={handlePhoneNumberChange}
									/>
								</div>
								<div>
									<Label htmlFor="designation">
										Designation*
									</Label>
									<Select
										options={designations}
										id="designation"
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
										id="teams"
										placeholder="Select a team"
										onChange={handleSelectChange}
										className="dark:bg-dark-900"
										required={
											isTeamSelectionResuired ?? false
										}
									/>
								</div>

								<div>
									<DatePicker
										id="date-picker"
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
								>
									Save
								</Button>
							</div>
						</form>
					</ComponentCard>
				</div>
			</div>
		</>
	);
}
