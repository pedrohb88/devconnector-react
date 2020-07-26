import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { createProfile, getCurrentProfile } from '../../actions/profile';

const initState = {
  company: '',
  website: '',
  location: '',
  status: '',
  skills: '',
  githubusername: '',
  bio: '',
  twitter: '',
  facebook: '',
  linkedin: '',
  youtube: '',
  instagram: '',
};

const ProfileForm = ({ createProfile, getCurrentProfile, history, profile: {profile}}) => {

  const [formData, setFormData] = useState(initState);

  useEffect(() => {
    if(!profile) getCurrentProfile();
    else {

      let newFormData = {...initState};

      Object.keys(initState).forEach(key => {
        const profileTmp = {...profile, ...profile.social};
        delete profileTmp['social'];
  
        const value = profileTmp[key];
  
        if(value && value.length){
          if(key === 'skills')
            newFormData[key] = value.join(',');
          else
            newFormData[key] = value;
        }
      });

      setFormData(newFormData);
    }
  }, [profile, getCurrentProfile]);

  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  const {
    company,
    website,
    location,
    status,
    skills,
    githubusername,
    bio,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram,
  } = formData;

  const onChange = e => setFormData({...formData, [e.target.name]: e.target.value});

  const onSubmit = e => {
    e.preventDefault();
    createProfile(formData, history, profile ? true : false);
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Crie seu Perfil</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Insira informações que façam seu perfil se destacar!
      </p>
      <small>* = Campo obrigatório</small>
      <form className="form" onSubmit={e => onSubmit(e)} >
        <div className="form-group">
          <select name="status" value={status} onChange={e => onChange(e)}>
            <option value="0">* Selecione seu cargo</option>
            <option value="Developer">Desenvolvedor(a)</option>
            <option value="Junior Developer">Desenvolvedor(a) Junior</option>
            <option value="Senior Developer">Desenvolvedor(a) Senior</option>
            <option value="Manager">Gerente</option>
            <option value="Student or Learning">Estudante</option>
            <option value="Instructor">Instrutor ou Professor</option>
            <option value="Intern">Estagiário(a)</option>
            <option value="Other">Outro</option>
          </select>
          <small className="form-text">
            Nos dê uma ideia do que você faz atualmente.
          </small>
        </div>
        <div className="form-group">
          <input type="text" placeholder="Empresa" name="company" value={company} onChange={e => onChange(e)} />
          <small className="form-text">
            Sua própria empresa ou a em que você trabalha
          </small>
        </div>
        <div className="form-group">
          <input type="text" placeholder="Website" name="website" value={website} onChange={e => onChange(e)} />
          <small className="form-text">
            Seu próprio site ou de uma empresa
          </small>
        </div>
        <div className="form-group">
          <input type="text" placeholder="Local" name="location" value={location} onChange={e => onChange(e)} />
          <small className="form-text">
            Sugestão: Cidade e Estado (Ex. Rio de Janeiro/RJ)
          </small>
        </div>
        <div className="form-group">
          <input type="text" placeholder="* Habilidades" name="skills" value={skills} onChange={e => onChange(e)} />
          <small className="form-text">
            Por favor, use valores separados por vírgula (Ex: HTML,CSS,JavaScript,PHP)
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nome de usuário Github"
            name="githubusername"
            value={githubusername} 
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            Se você deseja exibir seus repositórios, insira seu usuário do Github
          </small>
        </div>
        <div className="form-group">
          <textarea placeholder="Uma descrição curta sobre você" name="bio" value={bio} onChange={e => onChange(e)}></textarea>
          <small className="form-text">Nos conte um pouco sobre você</small>
        </div>

        <div className="my-2">
          <button onClick={() => toggleSocialInputs(!displaySocialInputs)} type="button" className="btn btn-light">
            Adicionar redes sociais
          </button>
          <span>Opcional</span>
        </div>

        {displaySocialInputs && 
        <Fragment>
          
        <div className="form-group social-input">
          <i className="fab fa-twitter fa-2x"></i>
          <input type="text" placeholder="Twitter URL" name="twitter" value={twitter} onChange={e => onChange(e)} />
        </div>

        <div className="form-group social-input">
          <i className="fab fa-facebook fa-2x"></i>
          <input type="text" placeholder="Facebook URL" name="facebook" value={facebook} onChange={e => onChange(e)} />
        </div>

        <div className="form-group social-input">
          <i className="fab fa-youtube fa-2x"></i>
          <input type="text" placeholder="YouTube URL" name="youtube" value={youtube} onChange={e => onChange(e)} />
        </div>

        <div className="form-group social-input">
          <i className="fab fa-linkedin fa-2x"></i>
          <input type="text" placeholder="Linkedin URL" name="linkedin" value={linkedin} onChange={e => onChange(e)} />
        </div>

        <div className="form-group social-input">
          <i className="fab fa-instagram fa-2x"></i>
          <input type="text" placeholder="Instagram URL" name="instagram" value={instagram} onChange={e => onChange(e)} />
        </div>
        </Fragment>}

        <input type="submit" className="btn btn-primary my-1" />
        <Link to='/dashboard' className="btn btn-light my-1">
          Voltar
        </Link>
      </form>
    </Fragment>
  );
};

ProfileForm.propTypes = {
  createProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { createProfile, getCurrentProfile }
)(withRouter(ProfileForm));
