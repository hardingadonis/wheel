import { useEffect, useState } from 'react';
import { TextStyle } from 'pixi.js';
import { Stage, Container, Sprite, Text } from '@pixi/react';

const WHEEL_BACKGROUND = '/wheel-background.png';

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

	const bunnyUrl = 'https://pixijs.io/pixi-react/img/bunny.png';

	return (
		<Stage
			width={stageWidth}
			height={stageWidth * 0.75}
			options={{ backgroundColor: 0x1099bb, backgroundAlpha: 0.8 }}
		>
			<Sprite image={WHEEL_BACKGROUND} x={300} y={150} />
			<Sprite image={bunnyUrl} x={500} y={150} />
			<Sprite image={bunnyUrl} x={400} y={200} />

			<Container x={200} y={200}>
				<Text
					text={ratio.toString()}
					anchor={0.5}
					x={220}
					y={150}
					style={
						new TextStyle({
							align: 'center',
							fill: '0xffffff',
							fontSize: 50,
							letterSpacing: 20,
							dropShadow: true,
							dropShadowColor: '#E72264',
							dropShadowDistance: 6,
						})
					}
				/>
			</Container>
		</Stage>
	);
};

export default Wheel;
