/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CANISTER_ID_BACKEND?: string;
  readonly VITE_DFX_NETWORK?: string;
  readonly VITE_II_URL?: string;
  readonly VITE_II_DERIVATION_ORIGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
