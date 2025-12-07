import { useState, useEffect } from 'react';

const initialFormState = {
  titulo: '',
  descricao: '',
  data: '',
  local: '',
  responsavel: '',
};

export default function WorkshopForm({ workshop, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (workshop) {
      setFormData({
        titulo: workshop.titulo || '',
        descricao: workshop.descricao || '',
        data: workshop.data ? workshop.data.split('T')[0] : '',
        local: workshop.local || '',
        responsavel: workshop.responsavel || '',
      });
    } else {
      setFormData(initialFormState);
    }
  }, [workshop]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }
    if (formData.descricao && formData.descricao.length > 500) {
      newErrors.descricao = 'Descrição não pode ter mais de 500 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {});

    onSubmit(data);
  };

  const inputClass = (fieldName) => `
    w-full px-4 py-3 bg-slate-700/50 border rounded-lg 
    focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition
    text-slate-100 placeholder-slate-500
    ${errors[fieldName] ? 'border-rose-500' : 'border-slate-600'}
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="titulo" className="block text-sm font-medium text-slate-300 mb-2">
            Título <span className="text-rose-400">*</span>
          </label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            value={formData.titulo}
            onChange={handleChange}
            className={inputClass('titulo')}
            placeholder="Digite o título da oficina"
          />
          {errors.titulo && (
            <p className="mt-1 text-sm text-rose-400">{errors.titulo}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="descricao" className="block text-sm font-medium text-slate-300 mb-2">
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className={inputClass('descricao')}
            placeholder="Digite a descrição da oficina"
            rows="4"
          />
          {errors.descricao && (
            <p className="mt-1 text-sm text-rose-400">{errors.descricao}</p>
          )}
          <p className="mt-1 text-xs text-slate-500">
            {formData.descricao.length}/500 caracteres
          </p>
        </div>

        <div>
          <label htmlFor="data" className="block text-sm font-medium text-slate-300 mb-2">
            Data
          </label>
          <input
            id="data"
            name="data"
            type="date"
            value={formData.data}
            onChange={handleChange}
            className={inputClass('data')}
          />
        </div>

        <div>
          <label htmlFor="local" className="block text-sm font-medium text-slate-300 mb-2">
            Local
          </label>
          <input
            id="local"
            name="local"
            type="text"
            value={formData.local}
            onChange={handleChange}
            className={inputClass('local')}
            placeholder="Endereço ou local da oficina"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="responsavel" className="block text-sm font-medium text-slate-300 mb-2">
            Responsável
          </label>
          <input
            id="responsavel"
            name="responsavel"
            type="text"
            value={formData.responsavel}
            onChange={handleChange}
            className={inputClass('responsavel')}
            placeholder="Nome do responsável pela oficina"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2.5 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-700/50 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-teal-600 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading && (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {workshop ? 'Atualizar' : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
}
