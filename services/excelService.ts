import ExcelJS from 'exceljs';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Sale } from '../types/index';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const exportToExcel = async (sales: Sale[]) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('판매 내역', {
      pageSetup: { paperSize: 9, orientation: 'portrait' },
      margins: { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75 },
    });

    worksheet.columns = [
      { header: '순번', key: 'no', width: 8, alignment: { horizontal: 'center' } },
      { header: '판매일', key: 'saleDate', width: 12, alignment: { horizontal: 'center' } },
      { header: '업체명', key: 'companyName', width: 18 },
      { header: '품목', key: 'productName', width: 15 },
      { header: '수량', key: 'quantity', width: 10, alignment: { horizontal: 'center' } },
      { header: '판매액', key: 'saleAmount', width: 15, alignment: { horizontal: 'right' } },
      { header: '결제수단', key: 'paymentMethod', width: 12, alignment: { horizontal: 'center' } },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2563EB' },
    };
    headerRow.alignment = { horizontal: 'center', vertical: 'center' };

    const paymentMethods: Record<string, string> = {
      cash: '현금',
      transfer: '계좌이체',
      credit: '미수금',
    };

    let dataRowIndex = 2;
    sales.forEach((sale, index) => {
      const row = worksheet.addRow({
        no: index + 1,
        saleDate: format(new Date(sale.saleDate), 'yyyy-MM-dd'),
        companyName: sale.companyName,
        productName: sale.productName,
        quantity: sale.quantity,
        saleAmount: sale.saleAmount,
        paymentMethod: paymentMethods[sale.paymentMethod] || sale.paymentMethod,
      });

      row.alignment = {
        horizontal: 'center',
        vertical: 'center',
        wrapText: true,
      };

      const amountCell = row.getCell('saleAmount');
      amountCell.numFmt = '#,##0';
      amountCell.alignment = { horizontal: 'right' };

      dataRowIndex++;
    });

    const totalRow = worksheet.addRow({
      no: '',
      saleDate: '합계',
      companyName: '',
      productName: '',
      quantity: sales.reduce((sum, sale) => sum + sale.quantity, 0),
      saleAmount: sales.reduce((sum, sale) => sum + sale.saleAmount, 0),
      paymentMethod: '',
    });

    totalRow.font = { bold: true, size: 11 };
    totalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE5E7EB' },
    };
    totalRow.getCell('saleAmount').numFmt = '#,##0';
    totalRow.getCell('saleAmount').alignment = { horizontal: 'right' };

    const buffer = await workbook.xlsx.writeBuffer();
    const uri = `${FileSystem.documentDirectory}oxygen_sales_${Date.now()}.xlsx`;

    await FileSystem.writeAsStringAsync(uri, Buffer.from(buffer).toString('base64'), {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(uri, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: '판매 내역 내보내기',
      UTI: 'com.microsoft.excel.xlsx',
    });

    return true;
  } catch (error) {
    console.error('Excel export error:', error);
    return false;
  }
};
