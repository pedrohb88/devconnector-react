import React, { Fragment, useState } from 'react'
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'

import {setAlert} from './../../actions/alert';
import {register} from './../../actions/auth';

const Register = ({setAlert, register, isAuthenticated}) => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const {name, email, password, password2} = formData;

    const onChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = e => {
        e.preventDefault();
        if(password !== password2){
            return setAlert('As senhas não são iguais', 'danger');
        }

        register({name, email, password});
        
        //Make the register requests withou redux actions
        //Using axios
        /*const newUser = {
            name, 
            email,
            password
        };
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const body = JSON.stringify(newUser);

            const res = await axios.post('/api/users', body, config);
            console.log(res.data);
        } catch (error) {
            const data = error.response.data;
            if(data.errors){
                alert(data.errors[0].msg);
            }

            
        }*/
    };

    //Redirect if logged in
    if(isAuthenticated){
        return <Redirect to="/dashboard" />
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Cadastro</h1>
            <p className="lead"><i className="fas fa-user"></i> Crie sua Conta</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input type="text" 
                    placeholder="Nome" 
                    name="name" 
                    value={name}  
                    onChange={e => onChange(e)}
                    required />
                </div>
                <div className="form-group">
                    <input type="email" 
                    placeholder="Email" 
                    name="email" 
                    value={email} 
                    onChange={e => onChange(e)}
                    required/>
                    <small className="form-text"
                    >Esse site usa Gravatar, então se você deseja ter uma foto de perfil, use um email Gravatar </small>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Senha"
                        name="password"
                        minLength="6"
                        value={password} 
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirmar Senha"
                        name="password2"
                        minLength="6"
                        value={password2} 
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Cadastrar" />
            </form>
            <p className="my-1">
                Já tem uma conta? {' '}
                <Link to="/login">Entrar</Link>
            </p>
        </Fragment>
    )
};

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(
    mapStateToProps,
    {setAlert, register}
)(Register);
