import React from "react";
import { Link } from "react-router-dom";

function DashboardActions() {
  return (
    <div className="dash-buttons">
      <Link to="/edit-profile" className="btn btn-light">
        <i className="fas fa-user-circle text-primary"></i> Editar Perfil
      </Link>
      <Link to="/add-experience" className="btn btn-light">
        <i className="fab fa-black-tie text-primary"></i> Adicionar Experiência
      </Link>
      <Link to="/add-education" className="btn btn-light">
        <i className="fas fa-graduation-cap text-primary"></i> Adicionar Formação
      </Link>
    </div>
  );
}

export default DashboardActions;
