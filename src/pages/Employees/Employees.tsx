import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
// import Badge from "../../components/ui/badge/Badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "../../components/ui/table";
import axios from "../../config/axios";
import { useEffect, useState } from "react";

interface Order {
	_id: string;
	name: string;
	avatar: string;
	designation: { name: string };
	// user: {
	// 	image: string;
	// 	name: string;
	// 	designation: string;
	// };
	teamHead: { name: string };
	// team: {
	// 	images: string[];
	// };
	// status: string;
	// budget: string;
}

// Define the table data using the interface
// const tableData: Order[] = [
// 	{
// 		id: 1,
// 		user: {
// 			// image: "/images/user/user-17.jpg",
// 			name: "Lindsey Curtis",
// 			designation: "Web Designer",
// 		},
// 		projectName: "Agency Website",
// 		team: {
// 			images: [
// 				"/images/user/user-22.jpg",
// 				"/images/user/user-23.jpg",
// 				"/images/user/user-24.jpg",
// 			],
// 		},
// 		budget: "3.9K",
// 		status: "Active",
// 	},
// 	{
// 		id: 2,
// 		user: {
// 			image: "/images/user/user-18.jpg",
// 			name: "Kaiya George",
// 			role: "Project Manager",
// 		},
// 		projectName: "Technology",
// 		team: {
// 			images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
// 		},
// 		budget: "24.9K",
// 		status: "Pending",
// 	},
// 	{
// 		id: 3,
// 		user: {
// 			image: "/images/user/user-17.jpg",
// 			name: "Zain Geidt",
// 			role: "Content Writing",
// 		},
// 		projectName: "Blog Writing",
// 		team: {
// 			images: ["/images/user/user-27.jpg"],
// 		},
// 		budget: "12.7K",
// 		status: "Active",
// 	},
// 	{
// 		id: 4,
// 		user: {
// 			image: "/images/user/user-20.jpg",
// 			name: "Abram Schleifer",
// 			role: "Digital Marketer",
// 		},
// 		projectName: "Social Media",
// 		team: {
// 			images: [
// 				"/images/user/user-28.jpg",
// 				"/images/user/user-29.jpg",
// 				"/images/user/user-30.jpg",
// 			],
// 		},
// 		budget: "2.8K",
// 		status: "Cancel",
// 	},
// 	{
// 		id: 5,
// 		user: {
// 			image: "/images/user/user-21.jpg",
// 			name: "Carla George",
// 			role: "Front-end Developer",
// 		},
// 		projectName: "Website",
// 		team: {
// 			images: [
// 				"/images/user/user-31.jpg",
// 				"/images/user/user-32.jpg",
// 				"/images/user/user-33.jpg",
// 			],
// 		},
// 		budget: "4.5K",
// 		status: "Active",
// 	},
// ];

export default function Employees() {
	const [tableData, setTableData] = useState([] as Order[]);
	useEffect(() => {
		// Fetch employees data when the component mounts
		(async () => {
			try {
				const employees = await axios.get("users");
				setTableData(employees?.data?.data);
			} catch (error) {
				console.error("Error fetching employees:", error);
			}
		})();
	}, []);
	return (
		<div>
			<PageMeta
				title="Employees"
				description="Employee management page"
			/>
			<PageBreadcrumb pageTitle="Employees" />
			<div className="space-y-6">
				<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
					<div className="max-w-full overflow-x-auto">
						<Table>
							{/* Table Header */}
							<TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
								<TableRow>
									<TableCell
										isHeader
										className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
									>
										User
									</TableCell>
									<TableCell
										isHeader
										className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
									>
										Team Head
									</TableCell>
									<TableCell
										isHeader
										className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
									>
										Team
									</TableCell>
									<TableCell
										isHeader
										className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
									>
										Status
									</TableCell>
									<TableCell
										isHeader
										className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
									>
										Budget
									</TableCell>
								</TableRow>
							</TableHeader>

							{/* Table Body */}
							<TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
								{tableData.map((order) => (
									<TableRow
										key={order._id}
										className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
									>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<Link to={"/"}>
												<div className="flex items-center gap-3 hover:[&_span]:underline">
													{order.avatar ? (
														<div className="w-10 h-10 overflow-hidden rounded-full">
															<img
																width={40}
																height={40}
																src={
																	order.avatar
																}
																alt={order.name}
															/>
														</div>
													) : (
														<div className="flex justify-between items-center w-10 h-10 overflow-hidden rounded-full">
															<img
																width={100}
																height={100}
																src="./images/user/default.png"
																alt="Default"
															/>
														</div>
													)}
													<div>
														<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
															{order.name}
														</span>
														<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
															{
																order
																	.designation
																	.name
															}
														</span>
													</div>
												</div>
											</Link>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											{order.teamHead.name}
										</TableCell>
										{/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex -space-x-2">
												{order.team.images.map(
													(teamImage, index) => (
														<div
															key={index}
															className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
														>
															<img
																width={24}
																height={24}
																src={teamImage}
																alt={`Team member ${index + 1}`}
																className="w-full size-6"
															/>
														</div>
													)
												)}
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<Badge
												size="sm"
												color={
													order.status === "Active"
														? "success"
														: order.status ===
															  "Pending"
															? "warning"
															: "error"
												}
											>
												{order.status}
											</Badge>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											{order.budget}
										</TableCell> */}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
}
