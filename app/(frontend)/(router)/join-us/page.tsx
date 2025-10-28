import CountdownPage from "./pages/CountdownPage";
import WhyJoinFintechClubPage from "./pages/WhyJoinFintechClubPage";
import StepsToRegisterPage from "./pages/StepsToRegisterPage";
import WhatAreYouWaitingForPage from "./pages/WhatAreYouWaitingForPage";

const JoinUs = () => {
	return (
		<>
			<CountdownPage />
			<WhyJoinFintechClubPage id="member-benefits" />
			<StepsToRegisterPage id="recruitment-process" />
			<WhatAreYouWaitingForPage id="join-now" />
		</>
	);
};

export default JoinUs;
