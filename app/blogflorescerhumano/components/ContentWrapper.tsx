import React from 'react';

interface ContentWrapperProps {
  children: React.ReactNode;
  isHome?: boolean;
}

const ContentWrapper = ({ children, isHome = false }: ContentWrapperProps) => {
  return (
    <div className={`${!isHome ? 'pt-[72px]' : ''}`}>
      {children}
    </div>
  );
};

export default ContentWrapper;
