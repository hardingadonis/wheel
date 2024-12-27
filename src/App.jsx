import React, { useEffect, useState } from 'react';

import LuckyWheel from './LuckyWheel';

const App = () => {
	return (
		<div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-center p-4">
			<h1 className="text-3xl font-bold mb-6 text-center">
				VÒNG XOAY PHÁT LỘC
			</h1>
			<LuckyWheel />
		</div>
	);
};

export default App;
