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
		<div className="flex flex-col items-center justify-center bg-yellow-100 p-4">
			<div className="flex flex-col items-center md:flex-row space-x-0 md:space-x-8">
				<canvas
					ref={canvasRef}
					width={canvasSize}
					height={canvasSize}
					className="max-w-full mb-8 md:mb-0"
				/>
				<div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
					<h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
						Thông tin cá nhân
					</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700"
						>
							Tên bạn là
						</label>
						<input
							id="name"
							type="text"
							name="name"
							value={userInfo.name}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
							required
						/>

						<label
							htmlFor="role"
							className="block text-sm font-medium text-gray-700"
						>
							Chọn vai trò
						</label>
						<select
							id="role"
							name="role"
							value={userInfo.role}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
							required
						>
							<option value="">Chọn vai trò</option>
							<option value="Chủ nuôi">Chủ nuôi</option>
							<option value="Đại lý">Đại lý</option>
						</select>

						<label
							htmlFor="phone"
							className="block text-sm font-medium text-gray-700"
						>
							Số điện thoại
						</label>
						<input
							id="phone"
							type="text"
							name="phone"
							value={userInfo.phone}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
							required
						/>

						<label
							htmlFor="location"
							className="block text-sm font-medium text-gray-700"
						>
							Bạn đang sinh sống tại
						</label>
						<input
							id="location"
							type="text"
							name="location"
							value={userInfo.location}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
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
							className={`w-full px-6 py-2 text-white rounded-lg ${
								isSpinning ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
							}`}
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
