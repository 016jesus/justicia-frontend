// ============================================
// ✅ OPTIMIZADO: jsPDF se carga SOLO cuando exportas
// ============================================

/**
 * Exporta procesos a PDF con marca de agua y diseño premium
 * ⚠️ IMPORTANTE: Esta función es ASYNC ahora
 */
export const exportToPDF = async (processes, userName = 'Usuario') => {
  try {
    // ✅ Dynamic import: jsPDF se descarga solo cuando se necesita (primera vez ~500ms)
    const [{ default: jsPDF }, _] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable')
    ]);

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ✅ Función para agregar marca de agua en cada página
    const addWatermark = () => {
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({ opacity: 0.1 }));
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(60);
      doc.text('JUSTICIA', pageWidth / 2, pageHeight / 2, {
        angle: 45,
        align: 'center'
      });
      doc.restoreGraphicsState();
    };

    // ✅ Función para agregar header
    const addHeader = () => {
      // Fondo del header
      doc.setFillColor(15, 23, 42); // Navy
      doc.rect(0, 0, pageWidth, 35, 'F');

      // Logo/Título
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('CONSULTAS DE PROCESOS', 15, 15);

      // Subtítulo
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('SISTEMA NACIONAL UNIFICADA', 15, 22);

      // Fecha de generación
      doc.setFontSize(8);
      doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, 15, 28);
      doc.text(`Por: ${userName}`, pageWidth - 15, 28, { align: 'right' });
    };

    // ✅ Función para agregar footer
    const addFooter = (pageNum) => {
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Página ${pageNum}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
      doc.text(
        'Documento Confidencial',
        15,
        pageHeight - 10
      );
    };

    // ===== PÁGINA 1: PORTADA =====
    addWatermark();
    
    // Fondo degradado simulado
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Título principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE', pageWidth / 2, 80, { align: 'center' });
    doc.text('PROCESOS JUDICIALES', pageWidth / 2, 95, { align: 'center' });

    // Línea decorativa
    doc.setDrawColor(217, 119, 6); // Dorado
    doc.setLineWidth(1);
    doc.line(40, 110, pageWidth - 40, 110);

    // Información del reporte
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total de procesos: ${processes.length}`, pageWidth / 2, 130, { align: 'center' });
    doc.text(`Generado por: ${userName}`, pageWidth / 2, 140, { align: 'center' });
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}`, pageWidth / 2, 150, { align: 'center' });

    // Box de confidencialidad
    doc.setFillColor(217, 119, 6);
    doc.roundedRect(30, pageHeight - 60, pageWidth - 60, 30, 5, 5, 'F');
    doc.setTextColor(26, 26, 26);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('⚠ DOCUMENTO CONFIDENCIAL', pageWidth / 2, pageHeight - 48, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Este documento contiene información sensible y privada', pageWidth / 2, pageHeight - 40, { align: 'center' });

    // ===== PÁGINA 2+: LISTADO DE PROCESOS =====
    doc.addPage();
    let pageNum = 2;

    addWatermark();
    addHeader();

    // Resumen estadístico
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('📊 Resumen Estadístico', 15, 45);

    const activos = processes.filter(p => p.estado === 'Activo').length;
    const inactivos = processes.length - activos;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`• Procesos activos: ${activos}`, 15, 55);
    doc.text(`• Procesos inactivos: ${inactivos}`, 15, 62);
    doc.text(`• Porcentaje activo: ${Math.round((activos / processes.length) * 100)}%`, 15, 69);

    // Tabla de procesos
    const tableData = processes.map(p => [
      p.radicacion || p.legalProcessId || 'N/A',
      p.estado || 'Sin estado',
      p.ultimaActuacion 
        ? new Date(p.ultimaActuacion).toLocaleDateString('es-ES')
        : 'N/A',
      p.despacho ? p.despacho.substring(0, 30) + '...' : 'N/A'
    ]);

    doc.autoTable({
      startY: 80,
      head: [['Radicación', 'Estado', 'Última Act.', 'Despacho']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [51, 65, 85]
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 30, halign: 'center' },
        3: { cellWidth: 70 }
      },
      margin: { top: 80, left: 15, right: 15 },
      didDrawPage: (data) => {
        addWatermark();
        addFooter(pageNum);
        pageNum++;
      }
    });

    // ✅ Guardar PDF
    const fileName = `Procesos_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    return fileName;
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw new Error('No se pudo generar el PDF. Intenta nuevamente.');
  }
};

/**
 * Exporta un solo proceso a PDF
 * ⚠️ IMPORTANTE: Esta función es ASYNC ahora
 */
export const exportProcessToPDF = async (process, actuaciones = []) => {
  try {
    // ✅ Dynamic import
    const [{ default: jsPDF }, _] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable')
    ]);

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Marca de agua
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.1 }));
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(60);
    doc.text('JUSTICIA', pageWidth / 2, pageHeight / 2, {
      angle: 45,
      align: 'center'
    });
    doc.restoreGraphicsState();

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('EXPEDIENTE JUDICIAL', 15, 15);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(process.llaveProceso || process.radicacion, 15, 25);

    // Información del proceso
    let y = 50;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Información del Proceso', 15, y);

    y += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Radicación: ${process.llaveProceso}`, 15, y);
    y += 7;
    doc.text(`Despacho: ${process.despacho || 'N/A'}`, 15, y);
    y += 7;
    doc.text(`Estado: ${process.estadoProceso || process.estado || 'N/A'}`, 15, y);
    y += 7;
    doc.text(`Ponente: ${process.ponente || 'N/A'}`, 15, y);

    // Actuaciones
    if (actuaciones.length > 0) {
      y += 15;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Actuaciones', 15, y);

      const tableData = actuaciones.slice(0, 20).map(a => [
        a.fechaActuacion 
          ? new Date(a.fechaActuacion).toLocaleDateString('es-ES')
          : 'N/A',
        a.actuacion || 'Sin descripción'
      ]);

      doc.autoTable({
        startY: y + 5,
        head: [['Fecha', 'Actuación']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255]
        }
      });
    }

    const fileName = `Proceso_${process.llaveProceso || 'Documento'}.pdf`;
    doc.save(fileName);
    return fileName;
  } catch (error) {
    console.error('Error generando PDF del proceso:', error);
    throw new Error('No se pudo generar el PDF. Intenta nuevamente.');
  }
};