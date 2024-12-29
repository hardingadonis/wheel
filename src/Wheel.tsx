import { useEffect, useState } from 'react';
import { Stage, Sprite } from '@pixi/react';

const WHEEL = '/wheel.png';
const KIM = '/kim.png';

const Wheel = () => {
	const [stageWidth, setStageWidth] = useState(window.innerWidth);
	const [ratio, setRatio] = useState(1.0);

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

	return (
		<Stage
			width={stageWidth}
			height={stageWidth * 0.78}
			options={{ backgroundColor: 0x1099bb, backgroundAlpha: 0.8 }}
		>
			<Sprite
				image={WHEEL}
				x={stageWidth / 2}
				y={(stageWidth * 0.78) / 2}
				width={1802 * 0.3 * ratio}
				height={1738 * 0.3 * ratio}
				pivot={{ x: 1802 / 2, y: 1738 / 2 }}
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
