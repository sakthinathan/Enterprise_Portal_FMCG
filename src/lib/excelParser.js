import * as XLSX from 'xlsx';

/**
 * Parses FMCG StockMRP Excel spreadsheets (.xlsx, .xls, .csv).
 * Extracting Material Code, Material Description, Brand, MRP, Conversion factor, and Good Qty (Cartons/Pcs).
 */
export const parseExcelFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const rawData = XLSX.utils.sheet_to_json(worksheet);

        const products = [];
        let totalRows = rawData.length;
        let filteredZeroQty = 0;
        const errors = [];

        rawData.forEach((originalRow, index) => {
          const row = {};
          Object.keys(originalRow).forEach(k => {
            row[k.trim().toLowerCase()] = originalRow[k];
          });

          const material = row['material'] || row['material code'] || row['material_code'] || row['code'];
          const description = row['material desc'] || row['material description'] || row['description'] || row['material_desc'] || row['name'];
          const brand = row['brand desc'] || row['brand description'] || row['brand'] || row['brand_desc'] || 'FMCG Brand';
          const mrp = parseFloat(row['mrp'] || row['price'] || '0');

          let conversion = 1;
          const convValues = [];
          Object.keys(row).forEach(key => {
            if (key.includes('conversion') || key.includes('case_pack') || key.includes('pack')) {
              const val = parseInt(row[key], 10);
              if (!isNaN(val) && val > 0) {
                convValues.push(val);
              }
            }
          });
          if (convValues.length > 0) {
            conversion = Math.max(...convValues);
          }

          let goodQty = parseFloat(row['good qty'] || row['good_qty'] || row['stock in cbb'] || row['stock_in_cbb'] || row['quantity'] || '0');

          if (!material) {
            errors.push(`Row ${index + 2}: Missing Material Code`);
            return;
          }

          if (goodQty <= 0) {
            filteredZeroQty++;
          }

          products.push({
            id: `sku-${Date.now()}-${index}`,
            material: String(material),
            materialDesc: String(description || material),
            brand: String(brand),
            mrp: isNaN(mrp) ? 0 : mrp,
            conversion: conversion,
            systemStockCbb: isNaN(goodQty) ? 0 : Math.round(goodQty),
            systemStockPcs: 0,
            physicalStockCbb: isNaN(goodQty) ? 0 : Math.round(goodQty),
            physicalStockPcs: 0,
            variance: 0,
            varianceValue: 0,
            status: 'Equal',
            godown: 'Godown #1 - Central'
          });
        });

        resolve({
          products,
          totalRows,
          filteredZeroQty,
          errors,
        });

      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};
