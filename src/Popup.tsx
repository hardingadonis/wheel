import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { setReward } from './rewardSlice';
import { useDispatch } from 'react-redux';
import { Bounce, toast } from 'react-toastify';

interface PopupProps {
	onClose: () => void;
}

const Popup = ({ onClose }: PopupProps) => {
	const [name, setName] = useState('');
	const [role, setRole] = useState('Chủ nuôi');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');

	const dispatch = useDispatch();

	const isPhoneValid = (phone: string) => {
		const phoneRegex = /^0[0-9]{9,10}$/;
		return phoneRegex.test(phone);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isPhoneValid(phone)) {
			Swal.fire({
				icon: 'error',
				title: 'Số điện thoại không hợp lệ!',
				text: 'Vui lòng nhập số điện thoại hợp lệ',
			});
			return;
		}

		toast.success('Đã gửi thông tin, vui lòng chờ trong giây lát', {
			position: 'top-right',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: false,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'light',
			transition: Bounce,
		});

		const response = await fetch(
			'https://script.google.com/macros/s/AKfycbx3jmIXkNQD9Tz_TRIV46Q18pPu2jkEUqeI66JbhZGxks-vnOCpCBOKqIrWDisTnAM2ZQ/exec',
			{
				method: 'POST',
				body: JSON.stringify({
					HoVaTen: name,
					VaiTro: role,
					SoDienThoai: phone,
					DiaChi: address,
				}),
			},
		);
		const data = await response.json();

		if (data.error) {
			Swal.fire({
				icon: 'info',
				title: 'Bạn đã nhận quà rồi!',
				html: `Vui lòng liên hệ <a href="https://www.facebook.com/profile.php?id=61561138291164" target="_blank" style="color: #007bff; text-decoration: underline;">Fanpage</a> để nhận quà.`,
			}).then((result) => {
				if (result.isConfirmed) {
					window.location.reload();
				}
			});
			return;
		}

		const reward = data.reward;

		console.info(reward);

		Swal.fire({
			icon: 'success',
			title: 'Thành công!',
			text: 'Bạn đã tham gia xé túi mù cùng ChiCha.',
		}).then((result) => {
			if (result.isConfirmed) {
				setName('');
				setRole('Chủ nuôi');
				setPhone('');
				setAddress('');

				dispatch(setReward(reward));

				onClose();
			}
		});
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white p-8 rounded-lg w-96 text-center shadow-lg transform transition-all duration-300 scale-95 hover:scale-100">
				<h2 className="text-2xl font-semibold text-gray-800 mb-6">
					Điền ngay - Quay liền
				</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-6">
						<label className="block text-left text-sm font-semibold text-gray-700 mb-2">
							Tên bạn là:
						</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Nhập tên"
							className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
						/>
					</div>

					<div className="mb-6">
						<label className="block text-left text-sm font-semibold text-gray-700 mb-2">
							Bạn là:
						</label>
						<select
							value={role}
							onChange={(e) => setRole(e.target.value)}
							className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
						>
							<option value="Chủ nuôi">Chủ nuôi</option>
							<option value="Đại lý">Đại lý</option>
						</select>
					</div>

					<div className="mb-6">
						<label className="block text-left text-sm font-semibold text-gray-700 mb-2">
							Số điện thoại:
						</label>
						<input
							type="tel"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							placeholder="Nhập số điện thoại"
							className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
						/>
					</div>

					<div className="mb-6">
						<label className="block text-left text-sm font-semibold text-gray-700 mb-2">
							Bạn đang sinh sống tại:
						</label>
						<input
							type="text"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							placeholder="Nhập địa chỉ"
							className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
						/>
					</div>

					<button
						type="submit"
						className="bg-blue-500 text-white px-6 py-3 rounded-md w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
					>
						Tham gia xé túi mù cùng ChiCha
					</button>
				</form>
			</div>
		</div>
	);
};

export default Popup;
