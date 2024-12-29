interface PopupProps {
	onClose: () => void;
}

const Popup = ({ onClose }: PopupProps) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white p-6 rounded-lg w-80 text-center">
				<h2 className="text-xl font-semibold mb-4">Welcome to the Website!</h2>
				<p className="mb-4">This is your popup message.</p>
				<button
					className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
					onClick={onClose}
				>
					Close
				</button>
			</div>
		</div>
	);
};

export default Popup;
