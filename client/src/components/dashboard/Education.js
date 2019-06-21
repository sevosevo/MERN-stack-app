import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {deleteFromProfile} from "../../actions/profile";

const Education = ({ education, deleteFromProfile }) => {

    const educationArr = education.map(ed => {
        const fromDate = new Date(ed.from);
        const toDate = !ed.to ? ed.to : new Date(ed.to);
        return (
            <tr key={ed._id}>
                <td>{ed.fieldofstudy}</td>
                <td className={"hide-sm"}>{ed.degree}</td>
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
                    <button className={"btn btn-danger"} onClick={() => deleteFromProfile(ed._id, 'education')}> Delete </button>
                </td>
            </tr>
        )});

    return (
        <Fragment>
            <h2 className={"my-2"}> Education</h2>
            <table className={"table"}>
                <thead>
                <tr>
                    <th>Field of study</th>
                    <th className={"hide-sm"}> Degree </th>
                    <th className={"hide-sm"}> Time </th>
                    <th />
                </tr>
                </thead>
                <tbody>
                {
                    educationArr
                }
                </tbody>
            </table>
        </Fragment>
    )
};

Education.propTypes = {
    education: PropTypes.array.isRequired,
    deleteFromProfile: PropTypes.func.isRequired
};

export default connect(null, { deleteFromProfile })(Education);