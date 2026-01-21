import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";

export default function Permissions() {
	return (
		<>
			<PageMeta
				title="Permissions Settings"
				description="Manage user permissions and access control"
			/>
			<PageBreadcrumb pageTitle="Permissions" />
			<div className="space-y-6">
				<ComponentCard title="Basic Table 1">
					<BasicTableOne />
				</ComponentCard>
			</div>
		</>
	);
}
