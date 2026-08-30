const LoadingSpinner = ({ size = "md" }) => { //md by default
	const sizeClass = `loading-${size}`;

	return <span className={`loading loading-dots ${sizeClass}`} />;
};
export default LoadingSpinner;