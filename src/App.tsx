import './App.css';
import { lazy, Suspense, useState, useEffect } from 'react';
import Popup from './Popup';
import { ToastContainer } from 'react-toastify';

const Wheel = lazy(() => import('./Wheel'));

const App = () => {
	const [isPopupVisible, setPopupVisible] = useState(false);

	useEffect(() => {
		setPopupVisible(true);
	}, []);

	const closePopup = () => {
		setPopupVisible(false);
	};

	return (
		<div className="flex flex-col items-center justify-center mt-[250px] md:ml-[100px]">
			{isPopupVisible && <Popup onClose={closePopup} />}{' '}
			<Suspense>
				<Wheel />
			</Suspense>
			<ToastContainer />
		</div>
	);
};

export default App;
