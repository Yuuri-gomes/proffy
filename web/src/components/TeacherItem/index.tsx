import React from 'react';

import './styles.css';

import whatsappIcon from '../../assets/images/icons/whatsapp.svg';

function TeacherItem() {
    return (
        <article className="teacher-item">
            <header>
                <img src="https://pbs.twimg.com/profile_images/1276326325410844677/PNQ-YTfV_400x400.jpg" alt="Yuri Gomes" />
                <div>
                    <strong>Yuri Gomes</strong>
                    <span>Física</span>
                </div>
            </header>

            <p>
                LOREM IPSUM SIT DOLOR AMET
                        <br />
                <br />
            </p>

            <footer>
                <p>Preço/hora
                            <strong> R$ 80.00</strong>
                </p>
                <button>
                    <img src={whatsappIcon} alt="Icone whatssap" />
                            Entrar em contato
                        </button>
            </footer>
        </article>
    )
}

export default TeacherItem;