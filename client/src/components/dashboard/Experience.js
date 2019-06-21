import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {deleteFromProfile} from "../../actions/profile";

const Experience = ({ experience, deleteFromProfile }) => {

    const experiences = experience.map(exp => {
        const fromDate = new Date(exp.from);
        const toDate = !exp.to ? exp.to : new Date(exp.to);
        return (
        <tr key={exp._id}>
            <td>{exp.company}</td>
            <td className={"hide-sm"}>{exp.title}</td>
            <td>
                From: {' '}
                {
                    [
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday'
                    ][fromDate.getDay()]
                    + '-'
                    + (parseInt(fromDate.getMonth()) + 1)
                    + '-'
                    + fromDate.getFullYear()
                }
                {' '} To: {' '}
                {
                    toDate === null ? (
                        '   Now'
                    ) : (
                        [
                            'Monday',
                            'Tuesday',
                            'Wednesday',
                            'Thursday',
                            'Friday',
                            'Saturday',
                            'Sunday'
                        ][toDate.getDay()]
                        + '-'
                        + (parseInt(toDate.getMonth()) + 1)
                        + '-'
                        + toDate.getFullYear()
                    )
                }
            </td>
            <td>
                <button className={"btn btn-danger"} onClick={() => deleteFromProfile(exp._id, 'experience')}> Delete </button>
            </td>
        </tr>
    )});

    return (
        <Fragment>
            <h2 className={"my-2"}> Experience credentials</h2>
            <table className={"table"}>
                <thead>
                    <tr>
                        <th>Company</th>
                        <th className={"hide-sm"}> Title </th>
                        <th className={"hide-sm"}> Years </th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                {
                    experiences
                }
                </tbody>
            </table>
        </Fragment>
    )
};

Experience.propTypes = {
    experience: PropTypes.array.isRequired,
    deleteFromProfile: PropTypes.func.isRequired
};
/*Manual
export default connect(null, dispatch => ({
    deleteFromProfile : (id, what) => dispatch(deleteFromProfile(id, what))
}))(Experience);
*/
export default connect(null, {
    deleteFromProfile
})(Experience);