import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Stage, Sprite } from '@pixi/react';
import { RootState } from './store';
import Swal from 'sweetalert2';
const WHEEL = '/wheel.png';
const KIM = '/kim.png';

const getIndexReward = (reward: string | null): number => {
	switch (reward) {
		case 'VOUCHER GIẢM 10%':
			return Math.random() < 0.5 ? 0 : 4;

		case 'VOUCHER MUA HÀNG ĐỒNG GIÁ 159K':
			return Math.random() < 0.5 ? 2 : 6;

		case '1 THÙNG CÁT + VOUCHER PETSHOP 200K':
			return Math.random() < 0.5 ? 3 : 5;

		case '1 THÙNG CÁT + VOUCHER PETSHOP 600K':
			return 1;

		case '1 THÙNG CÁT + 1 SET BABY THREE':
			return 7;
		default:
			return 0;
	}
};

const Wheel = () => {
	const [stageWidth, setStageWidth] = useState(window.innerWidth);
	const [ratio, setRatio] = useState(1.0);
	const [angle, setAngle] = useState(0);
	const [isSpin, setIsSpin] = useState(false);
	const reward = useSelector((state: RootState) => state.reward.reward);
	const [targetAngle, setTargetAngle] = useState(0);

	const updateStageWidth = () => {
		const isMobile = window.innerWidth <= 768;
		const newStageWidth = isMobile
			? window.innerWidth * 0.9
			: Math.min(window.innerWidth / 2, 600);

		setStageWidth(newStageWidth);
		setRatio(newStageWidth / 600);
	};

	useEffect(() => {
		window.addEventListener('resize', updateStageWidth);
		updateStageWidth();

		return () => {
			window.removeEventListener('resize', updateStageWidth);
		};
	}, []);

	useEffect(() => {
		let animationFrameId: number = 0;
		let lastTime: number;
		let speed: number = 600;

		const updateAngle = (time: number) => {
			if (lastTime == undefined) {
				lastTime = time;
			}

			const delta = time - lastTime;
			lastTime = time;

			setAngle((prevAngle) => {
				const newAngle = prevAngle + (speed * delta) / 1000;
				if (targetAngle - newAngle < 500) {
					if (speed > 20) speed = speed * 0.99;
				}
				if (newAngle >= targetAngle) {
					setAngle(targetAngle);
					setIsSpin(false);
					return targetAngle;
				}
				return newAngle;
			});

			if (isSpin) {
				animationFrameId = requestAnimationFrame(updateAngle);
			} else {
				cancelAnimationFrame(animationFrameId);
			}
		};

		if (isSpin) {
			animationFrameId = requestAnimationFrame(updateAngle);
		}

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSpin]);

	useEffect(() => {
		if (reward == null) return;
		const index = getIndexReward(reward);
		const again = Math.ceil(Math.random() * 10) + 5;
		const snap = Math.floor(Math.random() * (30 - 10 + 1)) + 10;

		const tempAngle = 360 * again + index * 45 + snap;
		setTargetAngle(tempAngle);
	}, [reward]);

	useEffect(() => {
		if (targetAngle === 0) return;
		setTimeout(() => {
			setIsSpin(true);
		}, 100);
	}, [targetAngle]);

	useEffect(() => {
		if (isSpin == false && reward != null) {
			setTimeout(() => {
				Swal.fire({
					icon: 'success',
					title: 'Chúc mừng!',
					html: `Bạn đã nhận được phần thưởng: <strong>${reward}</strong><br><br>
			Vui lòng liên hệ <a href="https://www.facebook.com/profile.php?id=61561138291164" target="_blank" style="color: #007bff; text-decoration: underline;">Fanpage</a> để nhận quà.`,
				}).then((result) => {
					if (result.isConfirmed) {
						window.location.reload();
					}
				});
			}, 700);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [angle]);

	return (
		<Stage
			width={stageWidth}
			height={stageWidth * 0.78}
			options={{ backgroundAlpha: 0 }}
		>
			<Sprite
				image={WHEEL}
				x={stageWidth / 2}
				y={(stageWidth * 0.78) / 2}
				width={1802 * 0.3 * ratio}
				height={1738 * 0.3 * ratio}
				pivot={{ x: 1802 / 2, y: 1738 / 2 }}
				angle={angle + 25}
			/>
			<Sprite
				image={KIM}
				x={stageWidth / 2}
				y={(stageWidth * 0.78) / 2}
				width={952 * 0.65 * ratio}
				height={832 * 0.65 * ratio}
				pivot={{ x: 952 / 2, y: 832 / 2 }}
			/>
		</Stage>
	);
};

export default Wheel;
