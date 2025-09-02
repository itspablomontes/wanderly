import { createFileRoute } from "@tanstack/react-router";
import HomeLayout from "../../features/home/layouts/HomeLayout";

export const Route = createFileRoute("/_home")({
	component: HomeLayout,
});
