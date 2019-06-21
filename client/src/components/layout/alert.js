import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//Extracting alerts from props
const Alert = ({ alerts })=> alert !== null &&
    alerts.length > 0 &&
    alerts.map(alert=>(
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            { alert.msg }
        </div>
    ));

Alert.propTypes ={
    alerts: PropTypes.array.isRequired
};

//Function that maps redux state to props of react component. Passed into connect() as first argument.
const mapStateToProps = state => ({
    alerts: state.alert
});

export default connect(mapStateToProps)(Alert);


