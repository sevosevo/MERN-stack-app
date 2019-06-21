import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile, deleteProfile} from "../../actions/profile";
import Experience from './Experience';
import Education from './Education';
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";

import DashboardActions from './DashboardActions';

const Dashboard = ({
  deleteProfile,
  getCurrentProfile,
  auth: { user, loading: authLoading },
  profile: { profile, loading: profileLoading }
}) => {
  useEffect(() => {

      getCurrentProfile();

  }, [getCurrentProfile]);
   
  return profileLoading || authLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>

      <p className="lead">
        <i className="fas fa-user" />
        Welcome {user && user.name}{" "}
      </p>
      {profile !== null ? (
        <Fragment>
          <DashboardActions />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />

          <div className={"my-2"}>
              <button className={"btn btn-danger"} onClick={()=>deleteProfile()}>
                  Delete account
              </button>
          </div>

        </Fragment>
      ) : (
        <Fragment>
          <p>You didn't setup your profile, do it now! </p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
    deleteProfile: PropTypes.func.isRequired
};

const mapStateToProps = ({ auth, profile }) => ({ auth, profile });

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteProfile }
)(Dashboard);
