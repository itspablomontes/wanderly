import { useTranslation } from "react-i18next";
import { Header } from "../components/Header";

export default function HomePage() {
	const { t } = useTranslation();

	return (
		<div className="font-bold">
			<header>
				<Header />
			</header>
			<main>{t("welcomeMessage")}</main>
		</div>
	);
}
