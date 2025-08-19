import { Outlet } from "@tanstack/react-router";

export default function HomeLayout() {
	return (
		<div className="bg-background">
			<Outlet />
		</div>
	);
}
