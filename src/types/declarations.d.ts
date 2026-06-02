

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

  interface Toast {
    (message: string, options?: ToastOptions): void;
    success(message: string, options?: ToastOptions): void;
    error(message: string, options?: ToastOptions): void;
    loading(message: string, options?: ToastOptions): void;
  }

  export const toast: Toast;
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
