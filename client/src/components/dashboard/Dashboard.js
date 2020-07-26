import React, {useEffect, Fragment} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';

const Dashboard = ({
    getCurrentProfile, 
    auth: {user}, 
    profile: {profile, loading},
    deleteAccount
}) => {

    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);

    return loading
    ? <Spinner /> 
    : <Fragment>
        <h1 className="large text-primary">Meu Painel</h1>
        <p className="lead">
            <i className="fas fa-user"></i>
            Bem-vindo(a) {user && user.name}
        </p>
        { profile !== null 
        ? <Fragment>
            <DashboardActions />
            <Experience experience={profile.experience} />
            <Education education={profile.education} />

            <div className="my-2">
                <button onClick={() => deleteAccount()} className="btn btn-danger">
                    <i className="fas fa-user-minus"></i>{' '}
                    Deletar minha conta
                </button>
            </div>
        </Fragment> 
        : <Fragment>
            <p>Você ainda não criou seu perfil!</p>
            <Link to='/create-profile' className="btn btn-primary my-1">Criar Perfil</Link>
        </Fragment> }

    </Fragment>;
};

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(
    mapStateToProps,
    {getCurrentProfile, deleteAccount}
)(Dashboard);
