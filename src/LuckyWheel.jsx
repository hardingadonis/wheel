import React, { useRef, useState, useEffect } from 'react';
import wheelSvg from './wheel.svg';

const LuckyWheel = ({ prizes, onSpinEnd, preDeterminedIndex }) => {
	const canvasRef = useRef(null);
	const [isSpinning, setIsSpinning] = useState(false);
	const [currentAngle, setCurrentAngle] = useState(0);
	const [spinDuration, setSpinDuration] = useState(5000); // Duration of spin in milliseconds

	const handleSpin = () => {
		if (isSpinning) return;

		setIsSpinning(true);
		const spinAngle = Math.random() * 360 + 720; // Random spin angle + 2 full rotations
		const finalAngle = (currentAngle + spinAngle) % 360;

		const spinAnimation = setInterval(() => {
			setCurrentAngle((prevAngle) => (prevAngle + 10) % 360);
		}, 16); // Roughly 60 frames per second

		setTimeout(() => {
			clearInterval(spinAnimation);
			setCurrentAngle(finalAngle);
			const prizeIndex = Math.floor((finalAngle / 360) * prizes.length);
			onSpinEnd(prizes[prizeIndex]);
			setIsSpinning(false);
		}, spinDuration);
	};

	useEffect(() => {
		if (preDeterminedIndex !== undefined) {
			const anglePerPrize = 360 / prizes.length;
			const targetAngle = (preDeterminedIndex * anglePerPrize) % 360;
			setCurrentAngle(targetAngle);
		}
	}, [prizes, preDeterminedIndex]);

	return (
		<div className="relative">
			<img
				src={wheelSvg}
				alt="Lucky Wheel"
				style={{
					transform: `rotate(${currentAngle}deg)`,
					transition: isSpinning
						? 'transform 5s cubic-bezier(0.33, 1, 0.68, 1)'
						: 'none',
				}}
				className="w-full h-auto"
			/>
			<button
				onClick={handleSpin}
				disabled={isSpinning}
				className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-2 px-4 rounded"
			>
				{isSpinning ? 'Đang quay...' : 'Quay'}
			</button>
		</div>
	);
};

export default LuckyWheel;
