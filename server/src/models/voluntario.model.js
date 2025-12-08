import mongoose from 'mongoose';
const { Schema } = mongoose;

const VoluntarioSchema = new Schema({
    nomeCompleto: { type: String, required: true, trim: true, index: true },
    cpf: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
        index: true,
        validate: {
            validator: async function (value) {
                if (!value) return true; // permite ausência de CPF
                const Vol = mongoose.models.Voluntario;
                const existing = Vol ? await Vol.findOne({ cpf: value }).exec() : null;
                if (!existing) return true;
                // permite quando o CPF pertence ao próprio documento (update)
                if (this._id) {
                    const currentId = this._id.toString();
                    const existingId = existing._id.toString();
                    return currentId === existingId;
                }
                return false;
            },
            message: 'CPF já cadastrado'
        }
    },
    rg: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    telefone: { type: String, trim: true },
    endereco: { type: String, trim: true },
    dataEntrada: { type: Date },
    dataSaida: { type: Date },
    ativo: { type: Boolean, default: true },
    oficinaId: [{ type: Schema.Types.ObjectId, ref: 'Oficina', index: true }],
    associacoes: [{
        oficinaId: { type: Schema.Types.ObjectId, ref: 'Oficina' },
        dataAssociacao: { type: Date, default: Date.now }
    }]
}, { timestamps: true, strictPopulate: false });

export default mongoose.models.Voluntario || mongoose.model('Voluntario', VoluntarioSchema);