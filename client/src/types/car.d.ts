export interface CarImage {
  url: string;
  public_id: string;
}

export interface Car {
  _id: string;
  ilanNo: string;
  ilanTarihi: string; // ISO string olarak gelir
  marka: string;
  model: string;
  seri?: string;
  yil: number;
  kilometre: number;
  renk: string;
  tipi?: string;
  yakitTipi?: string;
  motorHacmi?: string;
  motorGucu?: string;
  vitesTipi?: string;
  kasaTipi?: string;
  modifiye?: boolean;
  klasik?: boolean;
  acil?: boolean;
  ilanDetay?: string;
  ilanBasligi:string;
  ilanGoruntulenme?: number;
  fiyat: number;
  resimler: CarImage[];
  createdAt: string;
  updatedAt: string;
}
