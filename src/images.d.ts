/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_RAILWAY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.webp" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "pdf-parse" {
  function pdf(dataBuffer: Buffer, options?: any): Promise<any>;
  export default pdf;
}

declare module "mammoth" {
  export function extractRawText(options: { buffer: Buffer }): Promise<{ value: string; messages: any[] }>;
}
