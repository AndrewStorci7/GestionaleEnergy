import PropTypes from "prop-types"; // per ESLint
import { useState } from "react";

/**
 * @author Andrea Storci from Oppimittinetworking.com
 * @param {boolean} onToggle    Gestisce il click
 * @returns
 */
const Switch = ({ onToggle }) => {
	const [isOn, setIsOn] = useState(false);

	const toggleSwitch = () => {
		setIsOn(!isOn);
		onToggle(!isOn);
	};

	return (
		<div
			className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-all ${isOn ? "!bg-blue-500" : "!bg-gray-300"}`}
			onClick={toggleSwitch}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault(); // previene scroll quando si preme Space
					toggleSwitch();
				}
			}}
			aria-checked={isOn}
		>
			<div
				className={`bg-white w-6 h-6 rounded-full shadow-sm transform transition-transform ${isOn ? "translate-x-6" : "translate-x-0"}`}
			/>
		</div>
	);
};

Switch.propTypes = {
	onToggle: PropTypes.func.isRequired,
};

export default Switch;
