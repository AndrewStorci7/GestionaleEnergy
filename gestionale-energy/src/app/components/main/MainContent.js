"use client";

import SearchInput from "@/app/components/main/search/Search";
import Table from "@/app/components/main/table/Table";
import PropTypes from "prop-types"; // per ESLint

/**
 * Main Content Component
 * @author Andrea Storci from Oppimittinetworking
 *
 * @param {string} type     [ 'presser' | 'wheelman' | 'both' | 'admin' ]
 *
 * @param {*} props
 */
export default function MainContent({ type, implant, idUser, ...props }) {
	return (
		<div {...props}>
			<SearchInput type={type} />
			<Table type={type} implant={implant} idUser={idUser} />
		</div>
	);
}

MainContent.propTypes = {
	type: PropTypes.string.isRequired,
	implant: PropTypes.string.isRequired,
	idUser: PropTypes.string.isRequired,
};
