import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { downloadExcel } from 'react-export-table-to-excel';

import { Table } from '@tanstack/react-table';
import { ExtendedColumnDef, TAllowedExportFileTypes } from '@/types/global';
import '@/assets/fonts/NotoSansDevanagari-normal.js';

type THandleDownloadTableParams<T, V> = {
  columns: ExtendedColumnDef<T, V>[];
  data: T[];
  table: Table<T>;
  file: {
    name: string;
    type: TAllowedExportFileTypes;
    sheet: string;
  };
};

type TExportableData = {
  headers: string[];
  data: string[][];
};

const handleCSVExport = (data: TExportableData, fileName: string): void => {
  const csv = data.headers.join(',') + '\n';
  const rows = data.data.map((row) => row.join(',') + '\n');

  const blob = new Blob([csv, ...rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'export.csv';
  a.click();

  URL.revokeObjectURL(url);
};

const handlePDFExport = (data: TExportableData, fileName: string): void => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [1000, 1000],
  });
  // doc.addFont(NotoSansDevanagari, 'NotoSansDevanagari', 'normal');
  doc.setFont('NotoSansDevanagari', 'normal');

  autoTable(doc, {
    head: [data.headers],
    body: data.data,
    horizontalPageBreak: true,
    horizontalPageBreakBehaviour: 'afterAllRows',
    headStyles: {
      fillColor: [195, 243, 221], //light green
      textColor: [0, 0, 0], //black
      font: 'NotoSansDevanagari',
      fontStyle: 'normal',
      overflow: 'linebreak',
      cellPadding: 3,
      fontSize: 8,
      cellWidth: 'wrap',
    },
    styles: {
      font: 'NotoSansDevanagari',
      fontStyle: 'normal',

      // overflow: 'linebreak',
    },
  });

  doc.save(fileName || 'export.pdf');
};

const handleTXTExport = (data: TExportableData, fileName: string): void => {
  const csv = data.headers.join(',') + '\n';
  const rows = data.data.map((row) => row.join(',') + '\n');

  const blob = new Blob([csv, ...rows], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'export.txt';
  a.click();

  URL.revokeObjectURL(url);
};

const handleXLSXExport = (
  data: TExportableData,
  fileName: string,
  sheet: string,
): void => {
  downloadExcel({
    fileName: fileName || 'export.xlsx',
    sheet: sheet || 'Sheet 1',
    tablePayload: {
      body: data.data,
      header: data.headers,
    },
  });
};

const resolveDataOf = <TData>(
  key: keyof TData,
  data: TData,
): string | undefined => {
  if (!key || typeof key !== 'string') {
    return undefined;
  }
  const keys = key.split('.');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getValue = (obj: any, keys: string[]): any => {
    if (keys.length === 0) {
      return JSON.stringify(obj);
    }

    const [currentKey, ...restKeys] = keys;

    if (!currentKey) {
      return getValue(obj, restKeys);
    }

    if (Array.isArray(obj[currentKey])) {
      return (
        obj[currentKey]
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any) => getValue(item, restKeys))
          .join(', ')
      );
    }

    if (obj[currentKey] && typeof obj[currentKey] === 'object') {
      return getValue(obj[currentKey], restKeys);
    }
    // if (currentKey === 'id' && index !== undefined) {
    //   return `${index}`;
    // }
    return obj[currentKey];
  };

  const result = getValue(data, keys);

  if (typeof result === 'object' && result !== null) {
    return JSON.stringify(result);
  }

  return result;
};

const getSelectedTableRows = <TData>(table: Table<TData>): string[] => {
  const x = table
    .getSelectedRowModel()
    .rows.map((row) => {
      const dataWithId = row.original as { id: string };

      if (dataWithId.id) {
        return dataWithId.id;
      }

      return undefined;
    })
    .filter((v) => v !== undefined) as string[];

  return x;
};

const parseExportableData = <TData, TValue>(
  columns: ExtendedColumnDef<TData, TValue>[],
  data: TData[],
  table: Table<TData>,
): TExportableData => {
  const selected = getSelectedTableRows(table);

  // Filter out the 'id' field from the headers
  const headers = columns
    .map((column) => column.map?.key)
    .filter((item) => item !== undefined) as string[];

  const keys = columns.map((column) => ({
    item: column.map?.valueFrom || column.map?.mergedValuesFrom,
    transformer: column.map?.dataTransformer,
  }));

  const filteredData = data.filter((row) => {
    if (selected.length === 0) {
      return true;
    }

    const dataWithId = row as { id: string };

    return selected.includes(dataWithId.id);
  });

  const resolvedData = filteredData.map((row, idx) => {
    return keys
      .map((key) => {
        if (key.item === 'id') {
          return idx + 1;
        }
        if (key.transformer) {
          return key.transformer(row);
        }

        if (Array.isArray(key.item)) {
          const d = key.item
            .map((k) => {
              if (k !== undefined && typeof k === 'string') {
                return resolveDataOf(k as keyof TData, row);
              }

              return undefined;
            })
            .filter((v) => v !== undefined)
            .join(', ');

          return d;
        }

        return resolveDataOf(key.item as keyof TData, row);
      })
      .filter((v) => v !== undefined);
  });

  return {
    headers,
    data: resolvedData as string[][],
  };
};

export const handleDownloadTable = <TData, TValue>({
  columns,
  data,
  table,
  file,
}: THandleDownloadTableParams<TData, TValue>): void => {
  // For exporting data based on row selection, every data row should have a unique identifier 'id'.

  const exportable = parseExportableData(columns, data, table);

  switch (file.type) {
    case 'csv':
      handleCSVExport(exportable, file.name);
      break;
    case 'pdf':
      handlePDFExport(exportable, file.name);
      break;
    case 'txt':
      handleTXTExport(exportable, file.name);
      break;
    case 'xlsx':
      handleXLSXExport(exportable, file.name, file.sheet);
      break;
    default:
      handleCSVExport(exportable, file.name);
      break;
  }
};
