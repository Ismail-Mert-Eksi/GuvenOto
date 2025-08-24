// src/utils/formatBrand.ts
export const formatBrandFileName = (brand: string): string => {
  return brand
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9-]/g, '');
};
