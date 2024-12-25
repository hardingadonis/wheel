import React from 'react';
import LuckyWheel from './LuckyWheel';

const App = () => {
	const prizes = [
		{ label: 'Voucher 159K', image: '/public/img/voucher159k.png' },
		{ label: 'Giảm 10%', image: '/public/img/voucher159k.png' },
		{ label: 'Hộp quà đặc biệt', image: '/public/img/voucher159k.png' },
		{
			label: 'Thùng cát & Voucher 600K',
			image: '/public/img/voucher159k.png',
		},
		{
			label: 'Thùng cát & Voucher 200K',
			image: '/public/img/voucher159k.png',
		},
	];

	const handleSpinEnd = (prize) => {
		alert(`Chúc mừng! Bạn đã trúng: ${prize}`);
	};

	return (
		<div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-center">
			<h1 className="text-3xl font-bold mb-6">Vòng Quay May Mắn</h1>
			<LuckyWheel
				prizes={prizes}
				onSpinEnd={handleSpinEnd}
				preDeterminedIndex={2} // Thiết lập giải thưởng mong muốn (Hộp quà đặc biệt)
			/>
		</div>
	);
};

export default App;
