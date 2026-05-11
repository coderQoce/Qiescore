// Type declarations for packages without built-in types

declare module 'sonner' {
  import * as React from 'react';
  
  export interface ToasterProps {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
    toastOptions?: {
      style?: React.CSSProperties;
    };
  }
  
  export interface ToastOptions {
    id?: string;
    duration?: number;
    action?: {
      label: string;
      onClick: () => void;
    };
  }
  
  export function toast(message: string, options?: ToastOptions): void;
  export function toast.success(message: string, options?: ToastOptions): void;
  export function toast.error(message: string, options?: ToastOptions): void;
  export function toast.loading(message: string, options?: ToastOptions): void;
  
  export const Toaster: React.FC<ToasterProps>;
}

declare module 'react-dom/client' {
  import * as React from 'react';
  
  export interface Root {
    render(element: React.ReactElement): void;
    unmount(): void;
  }
  
  export function createRoot(container: Element | DocumentFragment): Root;
}
