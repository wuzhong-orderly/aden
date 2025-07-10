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

	return (
		<SimpleDialog
			open={isOpen}
			onOpenChange={setIsOpen}
			title="Service Access Restrictions"
			size="sm"
			closable={false}
			actions={actions}
		>
			<div className="space-y-4">
				<p className="text-sm text-gray-600">
					Aden uses Orderly Network&apos;s white-label solution and is not a direct operator of the orderbook.
				</p>
				
				<div>
					<h4 className="font-medium text-sm mb-2">Usage Restrictions:</h4>
					<ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
						<li>Users from restricted regions including the US and Singapore cannot use this service.</li>
						<li>Access through VPN or other circumvention methods is prohibited. Attempts to access from restricted regions may result in account suspension, and regional restrictions must always be complied with.</li>
					</ul>
				</div>

				<p className="text-sm text-gray-600">
					By clicking &apos;Agree&apos;, users will access a third-party website using Orderly software. ADEN confirms that it does not directly operate or control the infrastructure or take responsibility for code operations.
				</p>
			</div>
		</SimpleDialog>
	);
};

export default ServiceRestrictionsDialog; 