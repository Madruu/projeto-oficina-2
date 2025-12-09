import User from "../models/user.model.js";
import Oficina from "../models/oficina.model.js";
import Voluntario from "../models/voluntario.model.js";

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

/**
 * Seed de dados de exemplo (oficinas, voluntários e associações)
 */
export async function seedSampleData() {
  try {
    // Verifica se já existem dados
    const existingOficinas = await Oficina.countDocuments();
    const existingVoluntarios = await Voluntario.countDocuments();

    if (existingOficinas > 0 || existingVoluntarios > 0) {
      console.log(`ℹ️  Dados de exemplo já existem (${existingOficinas} oficinas, ${existingVoluntarios} voluntários)`);
      return;
    }

    // Criar oficinas
    const oficinasData = [
      {
        titulo: "Introdução à Programação",
        descricao: "Curso básico de lógica de programação e algoritmos para iniciantes",
        data: new Date("2025-01-15"),
        local: "Laboratório de Informática - Sala 101",
        responsavel: "Prof. Carlos Silva"
      },
      {
        titulo: "Robótica Educacional",
        descricao: "Oficina prática de montagem e programação de robôs com Arduino",
        data: new Date("2025-01-22"),
        local: "Oficina de Eletrônica - Bloco B",
        responsavel: "Prof. Ana Martins"
      },
      {
        titulo: "Design Gráfico",
        descricao: "Introdução ao design gráfico usando ferramentas gratuitas como Canva e Figma",
        data: new Date("2025-02-05"),
        local: "Sala Multimídia - Bloco A",
        responsavel: "Prof. Lucas Oliveira"
      },
      {
        titulo: "Inglês Básico",
        descricao: "Curso de inglês para iniciantes com foco em conversação",
        data: new Date("2025-02-12"),
        local: "Sala 205 - Bloco C",
        responsavel: "Prof. Maria Santos"
      },
      {
        titulo: "Matemática para o ENEM",
        descricao: "Revisão de conteúdos matemáticos com foco no ENEM",
        data: new Date("2025-02-19"),
        local: "Auditório Principal",
        responsavel: "Prof. Roberto Costa"
      }
    ];

    const oficinas = await Oficina.insertMany(oficinasData);
    console.log(`✅ ${oficinas.length} oficinas criadas`);

    // Criar voluntários com associações
    const voluntariosData = [
      {
        nomeCompleto: "João Pedro Almeida",
        cpf: "123.456.789-00",
        rg: "12.345.678-9",
        email: "joao.almeida@email.com",
        telefone: "(11) 99999-1111",
        endereco: "Rua das Flores, 123 - Centro",
        dataEntrada: new Date("2024-03-15"),
        ativo: true,
        oficinaId: [oficinas[0]._id, oficinas[1]._id],
        associacoes: [
          { oficinaId: oficinas[0]._id, dataAssociacao: new Date("2024-03-15") },
          { oficinaId: oficinas[1]._id, dataAssociacao: new Date("2024-04-10") }
        ]
      },
      {
        nomeCompleto: "Maria Clara Ferreira",
        cpf: "234.567.890-11",
        rg: "23.456.789-0",
        email: "maria.ferreira@email.com",
        telefone: "(11) 99999-2222",
        endereco: "Av. Brasil, 456 - Jardim América",
        dataEntrada: new Date("2024-04-01"),
        ativo: true,
        oficinaId: [oficinas[0]._id, oficinas[2]._id, oficinas[3]._id],
        associacoes: [
          { oficinaId: oficinas[0]._id, dataAssociacao: new Date("2024-04-01") },
          { oficinaId: oficinas[2]._id, dataAssociacao: new Date("2024-05-15") },
          { oficinaId: oficinas[3]._id, dataAssociacao: new Date("2024-06-01") }
        ]
      },
      {
        nomeCompleto: "Carlos Eduardo Santos",
        cpf: "345.678.901-22",
        rg: "34.567.890-1",
        email: "carlos.santos@email.com",
        telefone: "(11) 99999-3333",
        endereco: "Rua Ipiranga, 789 - Vila Nova",
        dataEntrada: new Date("2024-05-10"),
        ativo: true,
        oficinaId: [oficinas[1]._id, oficinas[4]._id],
        associacoes: [
          { oficinaId: oficinas[1]._id, dataAssociacao: new Date("2024-05-10") },
          { oficinaId: oficinas[4]._id, dataAssociacao: new Date("2024-07-20") }
        ]
      },
      {
        nomeCompleto: "Ana Beatriz Lima",
        cpf: "456.789.012-33",
        rg: "45.678.901-2",
        email: "ana.lima@email.com",
        telefone: "(11) 99999-4444",
        endereco: "Rua Consolação, 321 - Consolação",
        dataEntrada: new Date("2024-06-01"),
        ativo: true,
        oficinaId: [oficinas[2]._id],
        associacoes: [
          { oficinaId: oficinas[2]._id, dataAssociacao: new Date("2024-06-01") }
        ]
      },
      {
        nomeCompleto: "Lucas Henrique Souza",
        cpf: "567.890.123-44",
        rg: "56.789.012-3",
        email: "lucas.souza@email.com",
        telefone: "(11) 99999-5555",
        endereco: "Av. Paulista, 1000 - Bela Vista",
        dataEntrada: new Date("2024-02-20"),
        dataSaida: new Date("2024-10-15"),
        ativo: false,
        oficinaId: [oficinas[3]._id, oficinas[4]._id],
        associacoes: [
          { oficinaId: oficinas[3]._id, dataAssociacao: new Date("2024-02-20") },
          { oficinaId: oficinas[4]._id, dataAssociacao: new Date("2024-03-10") }
        ]
      },
      {
        nomeCompleto: "Fernanda Rodrigues Costa",
        cpf: "678.901.234-55",
        rg: "67.890.123-4",
        email: "fernanda.costa@email.com",
        telefone: "(11) 99999-6666",
        endereco: "Rua Augusta, 500 - Cerqueira César",
        dataEntrada: new Date("2024-07-15"),
        ativo: true,
        oficinaId: [oficinas[0]._id, oficinas[1]._id, oficinas[2]._id],
        associacoes: [
          { oficinaId: oficinas[0]._id, dataAssociacao: new Date("2024-07-15") },
          { oficinaId: oficinas[1]._id, dataAssociacao: new Date("2024-08-01") },
          { oficinaId: oficinas[2]._id, dataAssociacao: new Date("2024-09-10") }
        ]
      },
      {
        nomeCompleto: "Rafael Oliveira Mendes",
        cpf: "789.012.345-66",
        rg: "78.901.234-5",
        email: "rafael.mendes@email.com",
        telefone: "(11) 99999-7777",
        endereco: "Rua Oscar Freire, 200 - Pinheiros",
        dataEntrada: new Date("2024-08-01"),
        ativo: true,
        oficinaId: [oficinas[4]._id],
        associacoes: [
          { oficinaId: oficinas[4]._id, dataAssociacao: new Date("2024-08-01") }
        ]
      },
      {
        nomeCompleto: "Juliana Aparecida Pereira",
        cpf: "890.123.456-77",
        rg: "89.012.345-6",
        email: "juliana.pereira@email.com",
        telefone: "(11) 99999-8888",
        endereco: "Rua Haddock Lobo, 800 - Jardins",
        dataEntrada: new Date("2024-09-10"),
        ativo: true,
        oficinaId: [oficinas[1]._id, oficinas[3]._id],
        associacoes: [
          { oficinaId: oficinas[1]._id, dataAssociacao: new Date("2024-09-10") },
          { oficinaId: oficinas[3]._id, dataAssociacao: new Date("2024-10-05") }
        ]
      }
    ];

    const voluntarios = await Voluntario.insertMany(voluntariosData);
    console.log(`✅ ${voluntarios.length} voluntários criados com associações`);

  } catch (error) {
    console.error("❌ Erro ao criar dados de exemplo:", error.message);
  }
}

export default seedDefaultAdmin;

