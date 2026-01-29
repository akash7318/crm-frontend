import { NavItem } from "../layout/AppSidebar";
import { hasPermission } from "./hasPermission";

export const filterNavItems = (
	items: NavItem[],
	userPermissions: string[]
): NavItem[] => {
	return items
		.map((item) => {
			// Check parent permission
			if (
				item.permission &&
				!hasPermission(userPermissions, item.permission)
			) {
				return null;
			}

			// Filter sub items
			let filteredSubItems = item.subItems?.filter((sub) =>
				hasPermission(userPermissions, sub.permission)
			);

			// Remove parent if no sub-items left
			if (
				item.subItems &&
				(!filteredSubItems || filteredSubItems.length === 0)
			) {
				return null;
			}

			return {
				...item,
				subItems: filteredSubItems,
			};
		})
		.filter(Boolean) as NavItem[];
};
