import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getProfiles } from '../../actions/profile';
import ProfileItem from './ProfileItem';
import Spinner from '../layout/Spinner';

const Profiles = ({ getProfiles, profile: { profiles, loading }}) => {
    
    useEffect(() => {
        getProfiles();
    }, [getProfiles]);

    return loading
    ? <Spinner />
    : <Fragment>
    <h1 className="large text-primary">Desenvolvedores(as)</h1>
    <p className="lead">
        <i className="fab fa-connectdevelop"></i>
        Descubra novos Desenvolvedores(as)
    </p>
    <div className="profiles">
        {
        profiles.length > 0 
        ? (profiles.map(profile => (
            <ProfileItem key={profile._id} profile={profile} />
        ))) 
        : <h4>Nenhum Perfil encontrado</h4>
        }
    </div>
    </Fragment>;
};

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
