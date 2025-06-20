'use client';

import { createContext, useContext } from 'react';

interface PageContextType {
  shouldShowBlogSchema: boolean;
}

const PageContext = createContext<PageContextType>({ shouldShowBlogSchema: true });

export const usePageContext = () => useContext(PageContext);
export { PageContext };
