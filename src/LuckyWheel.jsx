import React, { useRef, useState, useEffect } from 'react';

const LuckyWheel = ({ prizes, onSpinEnd, preDeterminedIndex }) => {
	const canvasRef = useRef(null);
	const [isSpinning, setIsSpinning] = useState(false);
	const [currentAngle, setCurrentAngle] = useState(0);
	const [userInfo, setUserInfo] = useState({
		name: '',
		role: '',
		phone: '',
		location: '',
	});

	const canvasSize = 500;
	const radius = canvasSize / 2;

	// Function for text wrapping
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

		lines.forEach((line, index) => {
			ctx.fillText(line.trim(), x, y + index * lineHeight);
		});
	};

	// Draw the wheel
	const drawWheel = () => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const arcSize = (2 * Math.PI) / prizes.length;

		ctx.clearRect(0, 0, canvasSize, canvasSize);
		ctx.save();
		ctx.translate(radius, radius);
		ctx.rotate((currentAngle * Math.PI) / 180);
		ctx.translate(-radius, -radius);

		prizes.forEach((prize, index) => {
			const startAngle = arcSize * index;
			const endAngle = startAngle + arcSize;

			ctx.beginPath();
			ctx.moveTo(radius, radius);
			ctx.arc(radius, radius, radius, startAngle, endAngle);
			ctx.closePath();
			ctx.fillStyle = index % 2 === 0 ? '#FFD700' : '#FFA500';
			ctx.fill();
			ctx.strokeStyle = '#fff';
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.save();
			ctx.translate(radius, radius);
			ctx.rotate(startAngle + arcSize / 2);
			ctx.font = 'bold 14px Arial';
			ctx.fillStyle = '#000';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';

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

		ctx.beginPath();
		ctx.arc(radius, radius, radius - 5, 0, 2 * Math.PI);
		ctx.lineWidth = 10;
		ctx.strokeStyle = '#000';
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(radius, radius, radius * 0.1, 0, 2 * Math.PI);
		ctx.fillStyle = '#333';
		ctx.fill();
	};

	const drawArrow = () => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		ctx.beginPath();
		ctx.moveTo(radius, radius * 0.7);
		ctx.lineTo(radius - radius * 0.1, radius * 1);
		ctx.lineTo(radius + radius * 0.1, radius * 1);
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
		const spinDuration = 4000;
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

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setUserInfo({ ...userInfo, [name]: value });
	};

	const validatePhone = (phone) => {
		const phonePattern = /^[0-9]{10,11}$/;
		return phonePattern.test(phone);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validatePhone(userInfo.phone)) {
			spinWheel();
		} else {
			alert('Số điện thoại không hợp lệ.');
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 p-4">
			<div className="relative flex flex-col items-center">
				<canvas
					ref={canvasRef}
					width={canvasSize}
					height={canvasSize}
					className="max-w-full mb-8"
				/>
				<div className="w-full max-w-sm">
					<h2 className="text-xl font-bold mb-4 text-center">
						Thông tin cá nhân
					</h2>
					<form onSubmit={handleSubmit}>
						<input
							type="text"
							name="name"
							placeholder="Tên bạn là"
							value={userInfo.name}
							onChange={handleInputChange}
							className="mb-2 px-4 py-2 border rounded w-full"
							required
						/>
						<select
							name="role"
							value={userInfo.role}
							onChange={handleInputChange}
							className="mb-2 px-4 py-2 border rounded w-full"
							required
						>
							<option value="">Chọn vai trò</option>
							<option value="Chủ nuôi">Chủ nuôi</option>
							<option value="Đại lý">Đại lý</option>
						</select>
						<input
							type="text"
							name="phone"
							placeholder="Số điện thoại"
							value={userInfo.phone}
							onChange={handleInputChange}
							className="mb-2 px-4 py-2 border rounded w-full"
							required
						/>
						<input
							type="text"
							name="location"
							placeholder="Bạn đang sinh sống tại"
							value={userInfo.location}
							onChange={handleInputChange}
							className="mb-4 px-4 py-2 border rounded w-full"
							required
						/>
						<button
							type="submit"
							disabled={
								isSpinning ||
								!userInfo.name ||
								!userInfo.role ||
								!userInfo.phone ||
								!userInfo.location
							}
							className={`w-full px-6 py-2 text-white ${
								isSpinning ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
							} rounded`}
						>
							{isSpinning ? 'Đang quay...' : 'Quay Ngay!'}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default LuckyWheel;
