import { useState, useEffect } from 'react';

const initialFormState = {
  nomeCompleto: '',
  cpf: '',
  rg: '',
  email: '',
  telefone: '',
  endereco: '',
  dataEntrada: '',
  dataSaida: '',
  ativo: true,
};

export default function VolunteerForm({ volunteer, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (volunteer) {
      setFormData({
        nomeCompleto: volunteer.nomeCompleto || '',
        cpf: volunteer.cpf || '',
        rg: volunteer.rg || '',
        email: volunteer.email || '',
        telefone: volunteer.telefone || '',
        endereco: volunteer.endereco || '',
        dataEntrada: volunteer.dataEntrada ? volunteer.dataEntrada.split('T')[0] : '',
        dataSaida: volunteer.dataSaida ? volunteer.dataSaida.split('T')[0] : '',
        ativo: volunteer.ativo ?? true,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [volunteer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (formData.cpf && !/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      newErrors.cpf = 'CPF inválido (use apenas números ou formato 000.000.000-00)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Remove empty fields and format dates
    const data = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
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
        {/* Nome Completo */}
        <div className="md:col-span-2">
          <label htmlFor="nomeCompleto" className="block text-sm font-medium text-slate-300 mb-2">
            Nome Completo <span className="text-rose-400">*</span>
          </label>
          <input
            id="nomeCompleto"
            name="nomeCompleto"
            type="text"
            value={formData.nomeCompleto}
            onChange={handleChange}
            className={inputClass('nomeCompleto')}
            placeholder="Digite o nome completo"
          />
          {errors.nomeCompleto && (
            <p className="mt-1 text-sm text-rose-400">{errors.nomeCompleto}</p>
          )}
        </div>

        {/* CPF */}
        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-slate-300 mb-2">
            CPF
          </label>
          <input
            id="cpf"
            name="cpf"
            type="text"
            value={formData.cpf}
            onChange={handleChange}
            className={inputClass('cpf')}
            placeholder="000.000.000-00"
          />
          {errors.cpf && (
            <p className="mt-1 text-sm text-rose-400">{errors.cpf}</p>
          )}
        </div>

        {/* RG */}
        <div>
          <label htmlFor="rg" className="block text-sm font-medium text-slate-300 mb-2">
            RG
          </label>
          <input
            id="rg"
            name="rg"
            type="text"
            value={formData.rg}
            onChange={handleChange}
            className={inputClass('rg')}
            placeholder="00.000.000-0"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass('email')}
            placeholder="email@exemplo.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-rose-400">{errors.email}</p>
          )}
        </div>

        {/* Telefone */}
        <div>
          <label htmlFor="telefone" className="block text-sm font-medium text-slate-300 mb-2">
            Telefone
          </label>
          <input
            id="telefone"
            name="telefone"
            type="text"
            value={formData.telefone}
            onChange={handleChange}
            className={inputClass('telefone')}
            placeholder="(00) 00000-0000"
          />
        </div>

        {/* Endereço */}
        <div className="md:col-span-2">
          <label htmlFor="endereco" className="block text-sm font-medium text-slate-300 mb-2">
            Endereço
          </label>
          <input
            id="endereco"
            name="endereco"
            type="text"
            value={formData.endereco}
            onChange={handleChange}
            className={inputClass('endereco')}
            placeholder="Rua, número, bairro, cidade - UF"
          />
        </div>

        {/* Data Entrada */}
        <div>
          <label htmlFor="dataEntrada" className="block text-sm font-medium text-slate-300 mb-2">
            Data de Entrada
          </label>
          <input
            id="dataEntrada"
            name="dataEntrada"
            type="date"
            value={formData.dataEntrada}
            onChange={handleChange}
            className={inputClass('dataEntrada')}
          />
        </div>

        {/* Data Saída */}
        <div>
          <label htmlFor="dataSaida" className="block text-sm font-medium text-slate-300 mb-2">
            Data de Saída
          </label>
          <input
            id="dataSaida"
            name="dataSaida"
            type="date"
            value={formData.dataSaida}
            onChange={handleChange}
            className={inputClass('dataSaida')}
          />
        </div>

        {/* Status Ativo */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              name="ativo"
              type="checkbox"
              checked={formData.ativo}
              onChange={handleChange}
              className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-800"
            />
            <span className="text-sm font-medium text-slate-300">Voluntário ativo</span>
          </label>
        </div>
      </div>

      {/* Buttons */}
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
          {volunteer ? 'Atualizar' : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
}

