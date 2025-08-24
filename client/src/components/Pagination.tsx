import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // ——— helpers
  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, max));

  const pages = React.useMemo(() => {
    const out: (number | string)[] = [];
    const maxButtons = 9;
    const visibleRange = 2;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) out.push(i);
      return out;
    }

    out.push(1);
    if (currentPage > visibleRange + 2) out.push('…');

    for (
      let i = Math.max(currentPage - visibleRange, 2);
      i <= Math.min(currentPage + visibleRange, totalPages - 1);
      i++
    ) {
      out.push(i);
    }

    if (currentPage < totalPages - visibleRange - 1) out.push('…');
    out.push(totalPages);
    return out;
  }, [currentPage, totalPages]);

  const baseBtn =
    'inline-flex items-center justify-center rounded-full border transition ' +
    'px-3.5 h-9 text-sm font-medium select-none ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'focus-visible:ring-blue-500 focus-visible:ring-offset-white ';

  const solid =
    'bg-yellow-400 text-white border-yellow-400 shadow-sm hover:brightness-95 active:brightness-90';
  const ghost =
    'bg-white text-gray-800 border-gray-200 hover:bg-gray-50 active:bg-gray-100';
  const subtle =
    'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 active:bg-gray-300';

  const disabled =
    'opacity-50 cursor-not-allowed hover:none active:none';

  const goto = (p: number) => onPageChange(clamp(p, 1, totalPages));

  return (
    <nav
      aria-label="Sayfalama"
      className="mt-8 flex flex-col items-center gap-2"
    >
      {/* üst bilgi satırı (desktop’ta görünür) */}
      <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
          <strong className="text-gray-800">{currentPage}</strong>
          <span>/</span>
          <span>{totalPages}</span>
        </span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-600">Sayfalar arasında geziniyorsunuz</span>
      </div>

      {/* buton grubu */}
      <div className="flex items-center flex-wrap gap-1.5">
        {/* İlk / Geri */}
        <button
          type="button"
          onClick={() => goto(1)}
          disabled={currentPage === 1}
          className={`${baseBtn} ${subtle} ${currentPage === 1 ? disabled : ''}`}
          aria-label="İlk sayfa"
        >
          «
        </button>
        <button
          type="button"
          onClick={() => goto(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${baseBtn} ${subtle} ${currentPage === 1 ? disabled : ''}`}
          aria-label="Önceki sayfa"
        >
          ‹
        </button>

        {/* sayfa numaraları */}
        {pages.map((p, i) =>
          typeof p === 'string' ? (
            <span
              key={`dots-${i}`}
              className="px-2 text-gray-400 select-none"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => goto(p)}
              aria-current={p === currentPage ? 'page' : undefined}
              className={`${baseBtn} ${p === currentPage ? solid : ghost}`}
            >
              {p}
            </button>
          )
        )}

        {/* İleri / Son */}
        <button
          type="button"
          onClick={() => goto(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${baseBtn} ${subtle} ${currentPage === totalPages ? disabled : ''}`}
          aria-label="Sonraki sayfa"
        >
          ›
        </button>
        <button
          type="button"
          onClick={() => goto(totalPages)}
          disabled={currentPage === totalPages}
          className={`${baseBtn} ${subtle} ${currentPage === totalPages ? disabled : ''}`}
          aria-label="Son sayfa"
        >
          »
        </button>
      </div>

      {/* alt bilgi satırı (mobilde sade) */}
      <p className="sm:hidden text-xs text-gray-600">
        Sayfa <strong className="text-gray-900">{currentPage}</strong> / {totalPages}
      </p>
    </nav>
  );
};

export default Pagination;
