export const hasPermission = (
	userPermissions: string[],
	permission?: string
) => {
	if (!permission) return true;
	if (userPermissions?.includes("*")) return true;
	return userPermissions?.includes(permission);
};
