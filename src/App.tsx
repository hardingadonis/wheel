import './App.css';

import { lazy, Suspense } from 'react';

const Wheel = lazy(() => import('./Wheel'));

const App = () => {
	return (
		<div className="flex flex-col items-center justify-center mt-[250px] md:ml-[100px]">
			<Suspense>
				<Wheel />
			</Suspense>
		</div>
	);
};

export default App;
