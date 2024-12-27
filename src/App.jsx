import React, { useEffect, useState } from 'react';

import LuckyWheel from './LuckyWheel';

const App = () => {
	const handleSpinEnd = (prize) => {
		alert(`Chúc mừng! Bạn đã trúng: ${prize}`);
	};

	return (
		<div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-center p-4">
			<h1 className="text-3xl font-bold mb-6 text-center">Vòng Quay May Mắn</h1>
			<LuckyWheel onSpinEnd={handleSpinEnd} />
		</div>
	);
};

export default App;
