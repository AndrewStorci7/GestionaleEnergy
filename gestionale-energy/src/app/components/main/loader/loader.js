import PropTypes from "prop-types"; // per ESLint

const Loader = ({ message }) => {
	return (
		<div
			className="loader-container flex center"
			role="status"
			aria-live="polite"
		>
			<div className="spinner" />
			<div className="bg-white p-[5px] rounded-md">
				<p>{message}</p>
			</div>
		</div>
	);
};

Loader.propTypes = {
	message: PropTypes.string,
};

export default Loader;
