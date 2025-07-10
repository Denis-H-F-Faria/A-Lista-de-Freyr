// src/ficha.jsx
import { useEffect, useRef, useState } from 'react';
import './ficha.css'; // ou './ficha.css'

export default function Ficha() {
  const [pv, setPv] = useState(50);
  const [pvMax, setPvMax] = useState(50);
  const [pd, setPd] = useState(50);
  const [pdMax, setPdMax] = useState(50);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const pvBarRef = useRef();
  const pdBarRef = useRef();
  const animRef = useRef();
  const [nome] = useState("Nome do Personagem");
  const [classe] = useState("Paladino");
  const [raca] = useState("Elfo");
  const [nivel] = useState(6);
  const [velocidade] = useState("30ft");
  const [iniciativa] = useState("+2");
  const [ca] = useState(16);
  const [acoesTexto, setAcoesTexto] = useState('');

 useEffect(() => {
  let current = pvBarRef.current?.value || 0;
  const step = () => {
    const diff = pv - current;
    if (diff !== 0) {
      current += Math.sign(diff) * Math.ceil(Math.abs(diff) / 5);
      if ((diff > 0 && current > pv) || (diff < 0 && current < pv)) current = pv;
      pvBarRef.current.value = current;
      animRef.current = requestAnimationFrame(step);
    }
  };
  cancelAnimationFrame(animRef.current);
  step();
  return () => cancelAnimationFrame(animRef.current);
}, [pv, pvMax]);

useEffect(() => {
  let current = pdBarRef.current?.value || 0;
  const step = () => {
    const diff = pd - current;
    if (diff !== 0) {
      current += Math.sign(diff) * Math.ceil(Math.abs(diff) / 5);
      if ((diff > 0 && current > pd) || (diff < 0 && current < pd)) current = pd;
      pdBarRef.current.value = current;
      animRef.current = requestAnimationFrame(step);
    }
  };
  cancelAnimationFrame(animRef.current);
  step();
  return () => cancelAnimationFrame(animRef.current);
}, [pd, pdMax]);

  const habilidades = ["Atletismo", "Furtividade", "Religião", "Intuição", "Persuasão", "Percepção"];
  const atributos = ["FOR", "DES", "CON", "INT", "SAB", "CAR"];

  return (
    <div className="container my-4 text-light">
      {/* TOPO */}
      <div className="card-dd">
        <div className="row">
          <div className="col-md-2 text-center">
            <div className="avatar-circle" onClick={() => document.getElementById('avatarUpload').click()}>
              {avatarUrl ? <img src={avatarUrl} alt="avatar" /> : 'Upload'}
              <input
                type="file"
                id="avatarUpload"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setAvatarUrl(URL.createObjectURL(file));
                }}
              />
            </div>
          </div>
          <div className="col-md-10">
            <h2>{nome}</h2>
            <p className="mb-1">
              Classe: <strong>{classe}</strong> | Raça: <strong>{raca}</strong> | Nível: <strong>{nivel}</strong>
            </p>
            <p className="mb-0">
              Velocidade: <strong>{velocidade}</strong> | Iniciativa: <strong>{iniciativa}</strong> | CA: <strong>{ca}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* ATRIBUTOS */}
      <div className="card-dd">
        <h4>Atributos</h4>
        <div className="attribute-grid">
          {atributos.map((attr) => (
            <div className="stat-block" key={attr}>
              <h5>{attr}</h5>
              <div className="score" contentEditable>+0</div>
            </div>
          ))}
        </div>
      </div>

      {/* VIDA */}
      <div className="card-dd">
        <h4>Vida</h4>
        <div className="input-group mb-2">
          <span className="input-group-text">Atual</span>
          <input type="number" className="form-control" value={pv} onChange={(e) => setPv(parseInt(e.target.value || 0))} />
          <span className="input-group-text">/</span>
          <input type="number" className="form-control" value={pvMax} onChange={(e) => setPvMax(parseInt(e.target.value || 0))} />
        </div>
        <progress ref={pvBarRef} value={pv} max={pvMax} className="w-100"></progress>
      </div>

      {/* DEFESA */}
      <div className="card-dd">
        <h4>Defesa</h4>
        <div className="input-group mb-2">
          <span className="input-group-text">Atual</span>
          <input type="number" className="form-control" value={pd} onChange={(e) => setPd(parseInt(e.target.value || 0))} />
          <span className="input-group-text">/</span>
          <input type="number" className="form-control" value={pdMax} onChange={(e) => setPdMax(parseInt(e.target.value || 0))} />
        </div>
        <progress ref={pdBarRef} value={pd} max={pdMax} className="w-100 pd-bar"></progress>
      </div>

      {/* PERÍCIAS */}
      <div className="card-dd">
        <h4>Perícias</h4>
        <div className="row">
          {habilidades.map((skill, i) => (
            <div className="col-md-4 mb-2" key={i}>
              <label className="form-label">{skill}</label>
              <input type="number" className="form-control" />
            </div>
          ))}
        </div>
      </div>

      {/* AÇÕES */}
      <div className="card-dd">
        <h4>Ações</h4>
        <div className="editable-wrapper">
          <div
            className="editable"
            contentEditable
            onInput={(e) => setAcoesTexto(e.currentTarget.textContent)}
            suppressContentEditableWarning={true}
          ></div>
          {acoesTexto.trim() === '' && (
            <div className="placeholder">Adicione ataques, magias, bônus ou outras ações.</div>
          )}
        </div>
      </div>
    </div>
  );
}