import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { campanhaSchema } from '../schemas/auth'; // ou ../schemas/campanha se você separou

export default function ModalCriarCampanha({ aberto, onFechar, onCriar }) {
  const sistemasDisponiveis = ['D&D', 'Tormenta', 'Sistema Próprio'];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(campanhaSchema),
    defaultValues: {
      nome: '',
      sistema: '',
    },
  });

  const onSubmit = (data) => {
    onCriar(data);
    reset(); // limpa os campos após criar
  };

  if (!aberto) return null;

  return (
    <div
      className="modal d-flex justify-content-center align-items-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1050,
      }}
      onClick={onFechar}
    >
      <div
        className="card p-4"
        style={{ maxWidth: 400, width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h5 className="mb-3">Criar Nova Campanha</h5>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label>Nome da Campanha</label>
            <input
              type="text"
              className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
              {...register('nome')}
              autoFocus
            />
            {errors.nome && (
              <div className="invalid-feedback">{errors.nome.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label>Sistema</label>
            <select
              className={`form-select ${errors.sistema ? 'is-invalid' : ''}`}
              {...register('sistema')}
            >
              <option value="">Selecione um sistema</option>
              {sistemasDisponiveis.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.sistema && (
              <div className="invalid-feedback">{errors.sistema.message}</div>
            )}
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onFechar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}