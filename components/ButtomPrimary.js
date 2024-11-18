import PropTypes from "prop-types";
import clsx from "clsx";

function ButtonPrimary({ text = "ButtonPrimary", isActive = true, callback }) {
    return (
        <button
            onClick={callback}
            className={clsx(
                "p-2 text-white rounded-md text-center",
                isActive ? "bg-blue-500" : "bg-gray-300"
            )}
        >
            {text}
        </button>
    );
}

// Define prop types for validation
ButtonPrimary.propTypes = {
    text: PropTypes.string,
    isActive: PropTypes.bool,
    callback: PropTypes.func.isRequired,
};

export default ButtonPrimary;
