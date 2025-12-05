import User from "../models/user.model.js";

/**
 * Cria usuário admin padrão se não existir
 */
export async function seedDefaultAdmin() {
  const defaultAdmin = {
    nome: process.env.ADMIN_NAME || "Administrador",
    email: process.env.ADMIN_EMAIL || "admin@ellp.com",
    password: process.env.ADMIN_PASSWORD || "admin123",
    role: "admin",
  };

  try {
    const existingAdmin = await User.findOne({ email: defaultAdmin.email });

    if (!existingAdmin) {
      const admin = new User(defaultAdmin);
      await admin.save();
      console.log(`✅ Usuário admin criado: ${defaultAdmin.email}`);
    } else {
      console.log(`ℹ️  Usuário admin já existe: ${defaultAdmin.email}`);
    }
  } catch (error) {
    console.error("❌ Erro ao criar usuário admin:", error.message);
  }
}

export default seedDefaultAdmin;

