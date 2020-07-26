import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';

import { deleteEducation } from '../../actions/profile';

const Education = ({ education, deleteEducation }) => {
    const educations = education.map(edu => (
        <tr key={edu._id}>
            <td>{edu.school}</td>
            <td className="hide-sm">{edu.degree}</td>
            <td>
                <Moment format="DD/MM/YYYY">{edu.from}</Moment> - {
                    edu.to === null ? (' Now') : (<Moment format="DD/MM/YYYY">{edu.to}</Moment>)
                }
            </td>
            <td>
                <button onClick={() => deleteEducation(edu._id)} className="btn btn-danger">Apagar</button>
            </td>
        </tr>
    ));

    return (
        <Fragment>
            <h2 className="my-2">Formação</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Instituição</th>
                        <th className="hide-sm">Grau de certificação</th>
                        <th className="hide-sm">Data</th>
                        <th />
                    </tr>
                </thead>
                <tbody>{educations}</tbody>
            </table>
        </Fragment>
    )
};

Education.propTypes = {
    education: PropTypes.array.isRequired,
    deleteEducation: PropTypes.func.isRequired,
};

export default connect(null, { deleteEducation })(Education);
