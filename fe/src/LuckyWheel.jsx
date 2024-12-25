import React, { useRef, useState, useEffect } from 'react';

const LuckyWheel = ({ prizes, onSpinEnd, preDeterminedIndex }) => {
	const canvasRef = useRef(null);
	const [isSpinning, setIsSpinning] = useState(false);
	const [currentAngle, setCurrentAngle] = useState(0); // Góc hiện tại của vòng quay

	const canvasSize = 500;
	const radius = canvasSize / 2;

	// Vẽ vòng quay
	const drawWheel = () => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const arcSize = (2 * Math.PI) / prizes.length;

		ctx.clearRect(0, 0, canvasSize, canvasSize);
		ctx.save();
		ctx.translate(radius, radius);
		ctx.rotate((currentAngle * Math.PI) / 180); // Chỉ xoay phần vòng quay
		ctx.translate(-radius, -radius);

		prizes.forEach((prize, index) => {
			const startAngle = arcSize * index;
			const endAngle = startAngle + arcSize;

			// Tô màu xen kẽ cho các phần
			ctx.beginPath();
			ctx.moveTo(radius, radius);
			ctx.arc(radius, radius, radius, startAngle, endAngle);
			ctx.closePath();
			ctx.fillStyle = index % 2 === 0 ? '#FFD700' : '#FFA500';
			ctx.fill();
			ctx.strokeStyle = '#fff';
			ctx.lineWidth = 2;
			ctx.stroke();

			// Thêm ảnh phần thưởng
			if (prize.image) {
				const img = new Image();
				img.src = prize.image;
				img.onload = () => {
					ctx.save();
					ctx.translate(radius, radius);
					ctx.rotate(startAngle + arcSize / 2);
					ctx.translate(-radius, -radius);

					// Tính toán vị trí và kích thước ảnh
					const imgX =
						radius + radius * 0.5 * Math.cos(startAngle + arcSize / 2) - 30;
					const imgY =
						radius + radius * 0.5 * Math.sin(startAngle + arcSize / 2) - 30;
					const imgSize = 60; // Đảm bảo kích thước ảnh luôn vừa vặn
					ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
					ctx.restore();
				};
			}
		});

		ctx.restore();

		// Vẽ vòng tròn trung tâm
		ctx.beginPath();
		ctx.arc(radius, radius, radius * 0.1, 0, 2 * Math.PI);
		ctx.fillStyle = '#333';
		ctx.fill();
	};

	// Vẽ mũi tên chỉ cố định
	const drawArrow = () => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		ctx.beginPath();
		ctx.moveTo(radius, radius * 0.7); // Đỉnh mũi tên
		ctx.lineTo(radius - radius * 0.1, radius * 1); // Góc trái mũi tên
		ctx.lineTo(radius + radius * 0.1, radius * 1); // Góc phải mũi tên
		ctx.closePath();
		ctx.fillStyle = '#333';
		ctx.fill();
	};

	const spinWheel = () => {
		if (isSpinning) return;

		setIsSpinning(true);

		const resultIndex =
			preDeterminedIndex ?? Math.floor(Math.random() * prizes.length);
		const arcSize = 360 / prizes.length;

		const targetAngle = currentAngle + 360 * 5 + resultIndex * arcSize;
		const spinDuration = 4000; // Thời gian quay (ms)
		const startTime = performance.now();

		const animate = (time) => {
			const elapsed = time - startTime;

			if (elapsed < spinDuration) {
				// Tăng tốc dần khi mới bắt đầu và giảm tốc dần khi gần kết thúc
				const progress = elapsed / spinDuration;
				const easeOut = 1 - Math.pow(1 - progress, 3); // Tăng giảm tốc tự nhiên
				const angle = currentAngle + easeOut * (targetAngle - currentAngle);
				setCurrentAngle(angle);
				requestAnimationFrame(animate);
			} else {
				// Quay xong
				setCurrentAngle(targetAngle % 360); // Giữ lại góc cuối cùng
				setIsSpinning(false);
				onSpinEnd(prizes[resultIndex]); // Trả về kết quả
			}
		};

		requestAnimationFrame(animate);
	};

	useEffect(() => {
		drawWheel();
		drawArrow();
	}, [currentAngle]);

	return (
		<div className="flex flex-col items-center">
			<div className="relative">
				{/* Canvas cho vòng quay */}
				<canvas ref={canvasRef} width={canvasSize} height={canvasSize} />
			</div>
			<button
				onClick={spinWheel}
				disabled={isSpinning}
				className={`mt-4 px-6 py-2 text-white ${
					isSpinning ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
				} rounded`}
			>
				{isSpinning ? 'Đang quay...' : 'Quay Ngay!'}
			</button>
		</div>
	);
};

export default LuckyWheel;
