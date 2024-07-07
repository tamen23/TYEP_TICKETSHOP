import React from 'react';
import './organisateurSignUp.scss';
import OrganisateurModal from '../Shared/OrganisateurModal';

const OrganisateurSignUp = ({ onClose, show }) => {
    return (
        <OrganisateurModal onClose={onClose} show={show}>
            <div className="signUpForm">
                <h2>INSCRIVEZ-VOUS</h2>
                <form>
                    <div className="formGroup">
                        <input type="text" placeholder="Nom *" />
                        <input type="text" placeholder="Prénom *" />
                        <select>
                            <option value="Homme">Homme</option>
                            <option value="Femme">Femme</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>
                    <div className="formGroup">
                        <input type="email" placeholder="Adresse e-mail" />
                        <input type="email" placeholder="Répétez adresse e-mail *" />
                    </div>
                    <div className="formGroup">
                        <input type="password" placeholder="Mot de passe" />
                        <input type="password" placeholder="Répétez mot de passe *" />
                    </div>
                    <div className="formGroup">
                        <input type="text" placeholder="N° Téléphone *" />
                        <input type="text" placeholder="Adresse *" />
                    </div>
                    <div className="formGroup">
                        <select>
                            <option value="">Pays</option>
                            <option value="France">France</option>
                            <option value="Belgique">Belgique</option>
                        </select>
                        <input type="text" placeholder="Ville" />
                        <input type="text" placeholder="Code postal *" />
                    </div>
                    <div className="eventOptions">
                        <input type="checkbox" id="creatorOption" />
                        <label htmlFor="creatorOption">Devenir créateur d'événements</label>
                    </div>
                    <button type="submit">S'inscrire</button>
                    <p className="alreadyRegistered">Déjà inscrit</p>
                </form>
            </div>
        </OrganisateurModal>
    );
};

export default OrganisateurSignUp;
