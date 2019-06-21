import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';

import {getProfiles, clearProfile} from '../../actions/profile';
import ProfileItem from './ProfileItem';

const Profiles = ({ clearProfile, getProfiles, profile: {profiles, loading}}) => {

    useEffect(()=>{
        
            getProfiles();

        return () => {
            clearProfile();
        }

    }, [getProfiles,  clearProfile]);

    return (
        <Fragment>
            { loading ? <Spinner /> : (
                <Fragment>
                    <h1 className="large text-primary">Developers</h1>
                    <p className="lead">
                        Browse and connect with developers.
                    </p>
                    <div className="profiles">
                        {
                            Profiles.length >0 ? (
                                profiles.map(profile => <ProfileItem key={profile._id} profile={profile} />
                                )
                            ): <h4>No profiles found...</h4>
                        }
                    </div>
                </Fragment>
            ) 
            }
        </Fragment>
    )
}

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    clearProfile: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, { getProfiles, clearProfile })(Profiles);
