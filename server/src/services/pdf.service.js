import PDFDocument from 'pdfkit';

/**
 * Gera um PDF com as informações do voluntário
 * @param {Object} voluntario - Dados do voluntário populado com oficinas
 * @returns {PDFDocument} - Documento PDF
 */
export function generateVolunteerPDF(voluntario) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });

  // Cores do tema
  const primaryColor = '#06b6d4'; // cyan-500
  const secondaryColor = '#14b8a6'; // teal-500
  const textColor = '#1e293b'; // slate-800
  const lightTextColor = '#64748b'; // slate-500

  // Cabeçalho
  doc
    .fillColor(primaryColor)
    .fontSize(24)
    .font('Helvetica-Bold')
    .text('Termo de Voluntariado', 50, 50, { align: 'center' });

  // Linha decorativa
  doc
    .moveTo(50, 85)
    .lineTo(545, 85)
    .strokeColor(primaryColor)
    .lineWidth(2)
    .stroke();

  let yPosition = 110;

  // Seção: Dados do Voluntário
  doc
    .fillColor(textColor)
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('Dados do Voluntário', 50, yPosition);

  yPosition += 30;

  doc
    .fillColor(textColor)
    .fontSize(11)
    .font('Helvetica');

  // Nome
  doc
    .font('Helvetica-Bold')
    .text('Nome Completo:', 50, yPosition)
    .font('Helvetica')
    .text(voluntario.nomeCompleto || '-', 180, yPosition);
  yPosition += 20;

  // CPF
  doc
    .font('Helvetica-Bold')
    .text('CPF:', 50, yPosition)
    .font('Helvetica')
    .text(voluntario.cpf || '-', 180, yPosition);
  yPosition += 20;

  // RG
  if (voluntario.rg) {
    doc
      .font('Helvetica-Bold')
      .text('RG:', 50, yPosition)
      .font('Helvetica')
      .text(voluntario.rg, 180, yPosition);
    yPosition += 20;
  }

  // Email
  if (voluntario.email) {
    doc
      .font('Helvetica-Bold')
      .text('E-mail:', 50, yPosition)
      .font('Helvetica')
      .text(voluntario.email, 180, yPosition);
    yPosition += 20;
  }

  // Telefone
  if (voluntario.telefone) {
    doc
      .font('Helvetica-Bold')
      .text('Telefone:', 50, yPosition)
      .font('Helvetica')
      .text(voluntario.telefone, 180, yPosition);
    yPosition += 20;
  }

  // Endereço
  if (voluntario.endereco) {
    doc
      .font('Helvetica-Bold')
      .text('Endereço:', 50, yPosition)
      .font('Helvetica')
      .text(voluntario.endereco, 180, yPosition);
    yPosition += 20;
  }

  yPosition += 10;

  // Seção: Período de Atuação
  doc
    .fillColor(textColor)
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('Período de Atuação', 50, yPosition);

  yPosition += 30;

  doc
    .fontSize(11)
    .font('Helvetica-Bold')
    .text('Data de Entrada:', 50, yPosition)
    .font('Helvetica')
    .text(
      voluntario.dataEntrada
        ? new Date(voluntario.dataEntrada).toLocaleDateString('pt-BR')
        : '-',
      180,
      yPosition
    );
  yPosition += 20;

  if (voluntario.dataSaida) {
    doc
      .font('Helvetica-Bold')
      .text('Data de Saída:', 50, yPosition)
      .font('Helvetica')
      .text(
        new Date(voluntario.dataSaida).toLocaleDateString('pt-BR'),
        180,
        yPosition
      );
    yPosition += 20;
  }

  doc
    .font('Helvetica-Bold')
    .text('Status:', 50, yPosition)
    .font('Helvetica')
    .text(voluntario.ativo ? 'Ativo' : 'Inativo', 180, yPosition);
  yPosition += 30;

  // Seção: Oficinas Vinculadas
  doc
    .fillColor(textColor)
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('Oficinas Vinculadas', 50, yPosition);

  yPosition += 30;

  if (voluntario.oficinaId && voluntario.oficinaId.length > 0) {
    voluntario.oficinaId.forEach((oficina, index) => {
      // Verifica se precisa de nova página
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }

      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .fillColor(primaryColor)
        .text(`${index + 1}. ${oficina.titulo || 'Oficina sem título'}`, 50, yPosition);

      yPosition += 20;

      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor(textColor);

      if (oficina.descricao) {
        const descLines = doc.heightOfString(oficina.descricao, {
          width: 445,
          align: 'left'
        });
        doc.text(oficina.descricao, 70, yPosition, { width: 445 });
        yPosition += descLines + 10;
      }

      // Informações adicionais da oficina
      const infoLines = [];
      if (oficina.data) {
        infoLines.push(
          `Data: ${new Date(oficina.data).toLocaleDateString('pt-BR')}`
        );
      }
      if (oficina.local) {
        infoLines.push(`Local: ${oficina.local}`);
      }
      if (oficina.responsavel) {
        infoLines.push(`Responsável: ${oficina.responsavel}`);
      }

      if (infoLines.length > 0) {
        doc
          .fontSize(9)
          .fillColor(lightTextColor)
          .text(infoLines.join(' | '), 70, yPosition);
        yPosition += 15;
      }

      yPosition += 10;
    });
  } else {
    doc
      .fontSize(11)
      .font('Helvetica')
      .fillColor(lightTextColor)
      .text('Nenhuma oficina vinculada', 50, yPosition);
    yPosition += 20;
  }

  // Rodapé em todas as páginas
  const pageCount = doc.bufferedPageRange();
  for (let i = 0; i < pageCount.count; i++) {
    doc.switchToPage(i);
    
    // Linha decorativa no rodapé
    doc
      .moveTo(50, doc.page.height - 60)
      .lineTo(545, doc.page.height - 60)
      .strokeColor(primaryColor)
      .lineWidth(1)
      .stroke();

    // Texto do rodapé
    doc
      .fontSize(8)
      .fillColor(lightTextColor)
      .font('Helvetica')
      .text(
        `Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
        50,
        doc.page.height - 45,
        { align: 'center', width: 495 }
      );

    doc
      .fontSize(8)
      .text(
        'Sistema de Gestão de Voluntários',
        50,
        doc.page.height - 30,
        { align: 'center', width: 495 }
      );
  }

  return doc;
}

