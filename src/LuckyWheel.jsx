import React, { useRef, useState, useEffect } from 'react';

const LuckyWheel = ({ prizes, onSpinEnd, preDeterminedIndex }) => {
	const canvasRef = useRef(null);
	const [isSpinning, setIsSpinning] = useState(false);
	const [currentAngle, setCurrentAngle] = useState(0);

	const canvasSize = 500;
	const radius = canvasSize / 2;

	// Hàm để wrap text khi chữ quá dài
	const drawWrappedText = (ctx, text, x, y, maxWidth, lineHeight) => {
		const words = text.split(' ');
		let line = '';
		const lines = [];

		words.forEach((word, index) => {
			const testLine = line + word + ' ';
			const metrics = ctx.measureText(testLine);
			const testWidth = metrics.width;

			if (testWidth > maxWidth && index > 0) {
				lines.push(line);
				line = word + ' ';
			} else {
				line = testLine;
			}
		});

		lines.push(line);

		// Vẽ từng dòng text tại vị trí căn chỉnh
		lines.forEach((line, index) => {
			ctx.fillText(line.trim(), x, y + index * lineHeight);
		});
	};

	// Vẽ vòng quay
	const drawWheel = () => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const arcSize = (2 * Math.PI) / prizes.length;

		ctx.clearRect(0, 0, canvasSize, canvasSize);
		ctx.save();
		ctx.translate(radius, radius);
		ctx.rotate((currentAngle * Math.PI) / 180);
		ctx.translate(-radius, -radius);

		// Vẽ các phần của vòng quay
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

			// Vẽ label phần thưởng
			ctx.save();
			ctx.translate(radius, radius);
			ctx.rotate(startAngle + arcSize / 2);

			// Thiết lập font chữ
			ctx.font = 'bold 14px Arial';
			ctx.fillStyle = '#000';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';

			// Wrap text và căn giữa
			const textRadius = radius * 0.65;
			const maxWidth = radius * 0.5;
			const lineHeight = 16;
			const textLines = prize.label.split(' ');
			const totalHeight = lineHeight * (textLines.length - 1);
			const centerY = -totalHeight / 2;

			ctx.translate(textRadius, 0);
			ctx.rotate(Math.PI / 2);
			drawWrappedText(ctx, prize.label, 0, centerY, maxWidth, lineHeight);

			ctx.restore();
		});

		ctx.restore();

		// Vẽ vòng tròn bao quanh
		ctx.beginPath();
		ctx.arc(radius, radius, radius - 5, 0, 2 * Math.PI); // Giảm bán kính một chút
		ctx.lineWidth = 10; // Độ dày đường viền
		ctx.strokeStyle = '#000'; // Màu sắc
		ctx.stroke();

		// Vẽ vòng tròn trung tâm
		ctx.beginPath();
		ctx.arc(radius, radius, radius * 0.1, 0, 2 * Math.PI);
		ctx.fillStyle = '#333';
		ctx.fill();
	};

	// Vẽ mũi tên cố định
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
				const progress = elapsed / spinDuration;
				const easeOut = 1 - Math.pow(1 - progress, 3);
				const angle = currentAngle + easeOut * (targetAngle - currentAngle);
				setCurrentAngle(angle);
				requestAnimationFrame(animate);
			} else {
				setCurrentAngle(targetAngle % 360);
				setIsSpinning(false);
				onSpinEnd(prizes[resultIndex]);
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
				<canvas
					ref={canvasRef}
					width={canvasSize}
					height={canvasSize}
					className="max-w-full"
				/>
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
