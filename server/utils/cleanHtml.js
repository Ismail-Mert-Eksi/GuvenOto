// utils/cleanHtml.js
const sanitizeHtml = require('sanitize-html');

// Hem ImageKit hem de base64 (data:) kaynaklarına izin ver
const ALLOWED_IMAGE_SRC = /^(https?:\/\/ik\.imagekit\.io\/|data:image\/)/i;

function cleanHtml(dirty = "") {
  return sanitizeHtml(dirty, {
    allowedTags: [
      'p','br','b','strong','i','em','u','s',
      'ul','ol','li','blockquote','hr',
      'h1','h2','h3','h4','a','img','span'
    ],
    allowedAttributes: {
      a: ['href','name','target','rel'],
      // width/height/style'ı da açmak genelde faydalı olur
      img: ['src','alt','width','height','style'],
      '*': ['style'],
    },
    allowedStyles: {
      '*': {
        'color': [
          /^#[0-9a-fA-F]{3,8}$/,
          /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i,
          /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\s*\)$/i,
          /^[a-zA-Z]+$/
        ],
        'background-color': [
          /^#[0-9a-fA-F]{3,8}$/,
          /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i,
          /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\s*\)$/i,
          /^[a-zA-Z]+$/
        ],
        'text-align': [/^(left|right|center|justify)$/],
        'font-family': [/^[a-zA-Z0-9 ,'"\-]+$/],
        'font-size': [/^\d+(px|rem|em|%)$/],
        'line-height': [/^\d+(\.\d+)?(px|rem|em|%)?$/],
      },
    },
    // Linkleri güvenli yap
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', {
        rel: 'nofollow noopener noreferrer',
        target: '_blank',
      }),
    },
    // Önemli: data: şemasını da kabul et
    allowedSchemes: ['http', 'https', 'data'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data'],
    },
    // Sadece izin verilen görsel kaynaklarını bırak
    exclusiveFilter(frame) {
      if (frame.tag === 'img') {
        const src = frame.attribs?.src || '';
        // TRUE döndürürsen o node silinir; biz izin VERMEK istiyoruz
        return !ALLOWED_IMAGE_SRC.test(src);
      }
      return false;
    },
  });
}

module.exports = { cleanHtml };
