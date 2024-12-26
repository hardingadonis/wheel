import LuckyWheel from './LuckyWheel';

const App = () => {
	const prizes = [
		{ label: 'Voucher 159K' },
		{ label: 'Giảm 10%' },
		{ label: 'Hộp quà đặc biệt' },
		{ label: 'Thùng cát & Voucher 600K' },
		{ label: 'Thùng cát & Voucher 200K' },
	];

	const handleSpinEnd = (prize) => {
		alert(`Chúc mừng! Bạn đã trúng: ${prize.label}`);
	};

	return (
		<div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-center p-4">
			<h1 className="text-3xl font-bold mb-6 text-center">Vòng Quay May Mắn</h1>
			<LuckyWheel
				prizes={prizes}
				onSpinEnd={handleSpinEnd}
				preDeterminedIndex={2} // Thiết lập giải thưởng mong muốn (Hộp quà đặc biệt)
			/>
		</div>
	);
};

export default App;
