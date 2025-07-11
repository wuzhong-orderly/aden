import { useState, useEffect } from "react";
import { SimpleDialog } from "@orderly.network/ui";
import { useTranslation } from "@orderly.network/i18n";

const SERVICE_RESTRICTIONS_KEY = "aden_service_restrictions_accepted";

const ServiceRestrictionsDialog = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { i18n } = useTranslation();
	const isKorean = i18n.language === "ko";

	useEffect(() => {
		const hasAccepted = localStorage.getItem(SERVICE_RESTRICTIONS_KEY);
		if (!hasAccepted) {
			setIsOpen(true);
		}
	}, []);

	const handleAgree = () => {
		localStorage.setItem(SERVICE_RESTRICTIONS_KEY, "true");
		setIsOpen(false);
	};

	const toggleLanguage = () => {
		const newLang = isKorean ? "en" : "ko";
		i18n.changeLanguage(newLang);
	};

	const actions = {
		primary: {
			label: isKorean ? "동의" : "Agree",
			onClick: handleAgree
		}
	};

	const title = isKorean ? "서비스 이용 제한 안내" : "Service Access Restrictions";

	const content = isKorean ? {
		intro: "Aden은 Orderly Network의 화이트라벨 솔루션을 사용하며, 직접적인 오더북 운영 주체가 아닙니다.",
		restrictionsTitle: "이용 제한:",
		restrictions: [
			"미국 및 싱가포르 등의 금지 지역 거주자는 서비스 이용이 불가능합니다.",
			"VPN 등을 통한 우회 접속은 금지됩니다. 제한 지역 접속 시도 시 계정이 차단될 수 있으며, 지역 제한 사항을 항상 준수해야 합니다."
		],
		disclaimer: "'동의'를 클릭하면, 사용자는 Orderly 소프트웨어를 이용하여 제3자가 제공하는 웹사이트에 접속하게 됩니다. ADEN은 해당 인프라를 직접 운영하거나 통제하거나 코드 운영에 대한 책임을 지지 않음을 확인합니다."
	} : {
		intro: "Aden uses Orderly Network's white-label solution and is not a direct operator of the orderbook.",
		restrictionsTitle: "Usage Restrictions:",
		restrictions: [
			"Users from restricted regions including the US and Singapore cannot use this service.",
			"Access through VPN or other circumvention methods is prohibited. Attempts to access from restricted regions may result in account suspension, and regional restrictions must always be complied with."
		],
		disclaimer: "By clicking 'Agree', users will access a third-party website using Orderly software. ADEN confirms that it does not directly operate or control the infrastructure or take responsibility for code operations."
	};

	return (
		<SimpleDialog
			open={isOpen}
			onOpenChange={setIsOpen}
			title=""
			size="sm"
			closable={false}
			actions={actions}
		>
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-semibold text-white">
						{title}
					</h2>
					<button
						onClick={toggleLanguage}
						className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer font-medium"
					>
						{isKorean ? "English" : "한국어"}
					</button>
				</div>

				<p className="text-sm text-white/90 leading-relaxed">
					{content.intro}
				</p>
				
				<div>
					<h4 className="font-semibold text-white mb-3">{content.restrictionsTitle}</h4>
					<ul className="text-sm text-white/90 space-y-2 list-disc pl-5 leading-relaxed">
						{content.restrictions.map((restriction, index) => (
							<li key={index}>{restriction}</li>
						))}
					</ul>
				</div>

				<p className="text-sm text-white/80 leading-relaxed border-t border-white/20 pt-4">
					{content.disclaimer}
				</p>
			</div>
		</SimpleDialog>
	);
};

export default ServiceRestrictionsDialog; 