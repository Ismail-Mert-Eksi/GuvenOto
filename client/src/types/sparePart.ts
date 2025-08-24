// src/types/sparePart.ts

export interface SparePartImage {
  url: string;
  public_id: string;
}

export interface SparePart {
  _id: string;
  ilanNo: string;
  ilanBasligi: string;
  ilanDetay: string;        // HTML (server sanitize ediyor)
  fiyat?: number;           // opsiyonel
  marka?: string;           // opsiyonel
  resimler: SparePartImage[];
  ilanGoruntulenme: number; // default: 0 (server)
  ilanTarihi: string;       // ISO date string (server default: now)
}
