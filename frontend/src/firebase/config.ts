// The call system currently uses the API/local-storage signaling layer in
// `callService.ts`, so this module is kept as a lightweight compatibility shim.
// It avoids pulling in the Firebase SDK, which is not used by the current UI.

export const app = null;
export const db = null;
export const isFirebaseConfigured = false;
