import { useState, useEffect } from "react";
import { SimpleDialog } from "@orderly.network/ui";

const SERVICE_RESTRICTIONS_KEY = "aden_service_restrictions_accepted";

const ServiceRestrictionsDialog = () => {
	const [isOpen, setIsOpen] = useState(false);

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

	const actions = {
		primary: {
			label: "Agree",
			onClick: handleAgree
		}
	};

	const title = "Service Access Restrictions";

	const content = {
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
				<h2 className="text-xl font-semibold text-white">
					{title}
				</h2>

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