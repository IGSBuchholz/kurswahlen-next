import PropTypes from "prop-types";
import clsx from "clsx";
import Link from "next/link";

function LinkButtonPrimary({ text = "LinkButtonPrimary", link="/", prefetch=true, isActive = true}) {
    return (
        <Link

            className={clsx(
                "p-3 text-white rounded-md text-center",
                isActive ? "bg-blue-500" : "bg-gray-300"
            )}
         href={link}>
            {text}
        </Link>
    );
}

// Define prop types for validation
LinkButtonPrimary.propTypes = {
    text: PropTypes.string,
    link: PropTypes.string,
    prefetch: PropTypes.bool,
    isActive: PropTypes.bool,
};

export default LinkButtonPrimary;
