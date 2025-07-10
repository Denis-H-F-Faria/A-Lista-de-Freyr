// ficha.jsx (versão com Bootstrap, sem CSS personalizado)
import { useEffect } from 'react';

export default function Ficha() {
  useEffect(() => {
    document.querySelectorAll('.nav-link').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.nav-link.active')?.classList.remove('active');
        btn.classList.add('active');

        document.querySelector('.tab-pane.active')?.classList.remove('active', 'show');
        document.querySelector(btn.getAttribute('href'))?.classList.add('active', 'show');
      });
    });
  }, []);

  return (
    <div className="container py-4">
      <ul className="nav nav-tabs justify-content-center mb-4">
        <li className="nav-item">
          <a className="nav-link active" href="#ficha">Ficha</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#mochila">Mochila</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#habilidades">Habilidades</a>
        </li>
      </ul>

      <div className="tab-content">
        <div className="tab-pane fade show active" id="ficha">
          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Nome</label>
                <input type="text" className="form-control" id="nome" />
              </div>
              <h5 className="text-primary">Atributos</h5>
              {['for', 'von', 'agi', 'int', 'pre', 'sor'].map((attr) => (
                <div className="mb-2" key={attr}>
                  <label className="form-label text-capitalize">{attr}</label>
                  <input type="number" className="form-control" id={attr} min="0" max="10" />
                </div>
              ))}
              <h5 className="text-primary mt-3">Perícias</h5>
              {[
                'Luta', 'Mentira', 'Intuição', 'Pontaria', 'Medicina',
                'Atletismo', 'Pilotagem', 'Percepção', 'Furtividade',
                'Intimidação', 'Investigação', 'Conhecimento',
              ].map((skill, i) => (
                <div className="mb-2" key={i}>
                  <label className="form-label">{skill}</label>
                  <input type="number" className="form-control" min="0" max="5" />
                </div>
              ))}
            </div>

            <div className="col-md-4">
              <div className="mb-3 text-center border p-3" id="portrait" style={{ cursor: 'pointer', minHeight: '200px' }}>
                Clique para carregar imagem
              </div>
              <div className="mb-3">
                <label>Pontos de Vida</label>
                <div className="input-group mb-1">
                  <input type="number" className="form-control" id="pv" defaultValue="0" />
                  <span className="input-group-text">/</span>
                  <input type="number" className="form-control" id="pv-max" defaultValue="20" />
                </div>
                <progress id="pv-bar" value="0" max="20" className="w-100"></progress>
              </div>
              <div className="mb-3">
                <label>Defesa</label>
                <div className="input-group mb-1">
                  <input type="number" className="form-control" id="def" defaultValue="0" />
                  <span className="input-group-text">/</span>
                  <input type="number" className="form-control" id="def-max" defaultValue="12" />
                </div>
                <progress id="def-bar" value="0" max="12" className="w-100"></progress>
              </div>
              <div className="mb-3">
                <label>Nível</label>
                <input type="number" className="form-control" id="nivel" defaultValue="1" min="1" />
              </div>
              <div className="mb-3">
                <label>Experiência</label>
                <div className="input-group mb-1">
                  <input type="number" className="form-control" id="xp" defaultValue="0" />
                  <span className="input-group-text">/</span>
                  <input type="number" className="form-control" id="xp-max" defaultValue="100" />
                </div>
                <progress id="xp-bar" value="0" max="100" className="w-100"></progress>
              </div>
            </div>

            <div className="col-md-4">
              <div className="mb-3">
                <label>Arma Principal</label>
                <input type="text" className="form-control" id="arma1" />
              </div>
              <div className="mb-3">
                <label>Escudo</label>
                <input type="text" className="form-control" id="escudo" />
              </div>
              <div className="mb-3">
                <label>Arma Secundária</label>
                <input type="text" className="form-control" id="arma2" />
              </div>
              <div className="mb-3">
                <label>Equipamento</label>
                <input type="text" className="form-control" id="equip" />
              </div>
              <div className="mb-3">
                <label>Artefato</label>
                <div id="artefato" className="form-control" contentEditable={true} style={{ minHeight: '100px' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="tab-pane fade" id="mochila">
          <h4>Inventário</h4>
          <textarea className="form-control" rows="10"></textarea>
        </div>

        <div className="tab-pane fade" id="habilidades">
          <h4>Habilidades &amp; Poderes</h4>
          <textarea className="form-control" rows="10"></textarea>
        </div>
      </div>
    </div>
  );
}