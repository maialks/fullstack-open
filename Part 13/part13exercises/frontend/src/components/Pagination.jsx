import React, { useState } from 'react';
import BlogsContainer from '../features/blogs/BlogsContainer';

const PaginationButton = ({ onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className='px-2 text-secondary font-semibold text-xl cursor-pointer '
    >
      {label}
    </button>
  );
};

function Pagination({ items, render, itemsPerPage }) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const start = itemsPerPage * currentPage;
  const end = start + itemsPerPage;
  const itemsToShow = items.slice(start, end);

  const goToNext = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const goToPrevious = () =>
    setCurrentPage((prev) => {
      if (prev === 0) return totalPages - 1;
      return prev - 1;
    });
  return (
    <div className='flex flex-col items-center pb-2'>
      {render(itemsToShow)}
      <div className='flex gap-4 mt-4 items-center'>
        {totalPages > 1 && (
          <PaginationButton onClick={goToPrevious} label={'←'} currentPage={currentPage} />
        )}
        <span className='text-secondary font-sora font-semibold opacity-75'>
          Página {currentPage + 1} de {totalPages > 0 ? totalPages : 1}
        </span>
        {totalPages > 1 && (
          <PaginationButton onClick={goToNext} label={'→'} currentPage={currentPage} />
        )}
      </div>
    </div>
  );
}

export default Pagination;
