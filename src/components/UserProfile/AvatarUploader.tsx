import axios from "../../config/axios";
import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { checkIsLoggedIn } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

interface AvatarUploaderProps {
	uploadUrl: string;
	value?: string | null;
	size?: number;
	maxFileSizeMB?: number;
	onUploaded?: (url: string) => void;
}

interface Area {
	width: number;
	height: number;
	x: number;
	y: number;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = url;
	});

const getCroppedImg = async (imageSrc: string, crop: Area): Promise<Blob> => {
	const image = await createImage(imageSrc);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) throw new Error("Canvas not supported");

	canvas.width = crop.width;
	canvas.height = crop.height;

	ctx.drawImage(
		image,
		crop.x,
		crop.y,
		crop.width,
		crop.height,
		0,
		0,
		crop.width,
		crop.height
	);

	return new Promise((resolve) => {
		canvas.toBlob(
			(blob) => {
				if (!blob) throw new Error("Canvas is empty");
				resolve(blob);
			},
			"image/jpeg",
			0.9
		);
	});
};

export default function AvatarUploader({
	uploadUrl,
	value,
	size = 120,
	maxFileSizeMB = 2,
	onUploaded,
}: AvatarUploaderProps) {
	const dispatch = useDispatch<AppDispatch>();
	const [image, setImage] = useState<string | null>(null);
	const [preview, setPreview] = useState<string | null>(value || null);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
		null
	);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const onCropComplete = useCallback(
		(_: unknown, croppedAreaPixels: Area) =>
			setCroppedAreaPixels(croppedAreaPixels),
		[]
	);
	useEffect(() => {
		if (value) {
			setPreview(value);
		}
	}, [value]);

	const validateFile = (file: File) => {
		const maxSize = maxFileSizeMB * 1024 * 1024;
		if (file.size > maxSize) {
			setError(`File must be smaller than ${maxFileSizeMB}MB`);
			return false;
		}
		setError(null);
		return true;
	};

	const handleFile = (file: File) => {
		if (!validateFile(file)) return;
		setImage(URL.createObjectURL(file));
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.length) return;
		handleFile(e.target.files[0]);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (!e.dataTransfer.files?.length) return;
		handleFile(e.dataTransfer.files[0]);
	};

	const handleSave = async () => {
		if (!image || !croppedAreaPixels) return;

		// Create file with proper extension
		const blob = await getCroppedImg(image, croppedAreaPixels);
		const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });

		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("avatar", file);

			const res = await axios(uploadUrl, {
				method: "PATCH",
				data: formData,
			});

			const data = res.data.data;
			setPreview(data.avatar);
			onUploaded?.(data.avatar);
			// update user
			dispatch(checkIsLoggedIn());
		} catch (err: any) {
			setError(err.message || "Upload failed");
		} finally {
			setLoading(false);
			setImage(null);
		}
	};

	return (
		<div className="flex flex-col items-center">
			{/* Drag & Drop */}
			<div
				onDrop={handleDrop}
				onDragOver={(e) => e.preventDefault()}
				className="relative cursor-pointer"
			>
				<div
					className="rounded-full overflow-hidden bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center hover:border-indigo-500 transition"
					style={{ width: size, height: size }}
				>
					{preview ? (
						<>
							<img
								src={preview}
								alt="avatar"
								className="w-full h-full object-cover"
							/>
							<button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300">
								<svg
									className="fill-current"
									width="18"
									height="18"
									viewBox="0 0 18 18"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
										fill=""
									/>
								</svg>
							</button>
						</>
					) : (
						<span className="text-gray-400 text-sm text-center px-2">
							Drag & Drop
							<br />
							or Click
						</span>
					)}
				</div>

				<input
					type="file"
					accept="image/*"
					className="absolute inset-0 opacity-0 cursor-pointer"
					onChange={handleInputChange}
				/>
			</div>

			{error && <p className="text-red-500 text-xs mt-2">{error}</p>}
			{loading && (
				<p className="text-indigo-600 text-xs mt-2">Uploading...</p>
			)}

			{/* Crop Modal */}
			{image && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
					<div className="bg-white rounded-xl shadow-xl p-6 w-[380px]">
						<div className="relative w-full h-[300px]">
							<Cropper
								image={image}
								crop={crop}
								zoom={zoom}
								aspect={1}
								cropShape="round"
								showGrid={false}
								onCropChange={setCrop}
								onZoomChange={setZoom}
								onCropComplete={onCropComplete}
							/>
						</div>

						<input
							type="range"
							min={1}
							max={3}
							step={0.1}
							value={zoom}
							onChange={(e) => setZoom(Number(e.target.value))}
							className="w-full mt-4"
						/>

						<div className="flex justify-end gap-3 mt-5">
							<button
								onClick={() => setImage(null)}
								className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
							>
								Cancel
							</button>
							<button
								onClick={handleSave}
								className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
							>
								Save
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
