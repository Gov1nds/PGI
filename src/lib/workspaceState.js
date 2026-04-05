/**
 * workspaceState.js — backward-compat re-export shim.
 * All workspace functions are now canonical in workflowState.js (H-9 merge).
 */
export {
  saveGuestWorkspace,
  loadGuestWorkspace,
  clearGuestWorkspace,
} from "./workflowState";

export {
  readGuestSessionToken,
  writeGuestSessionToken,
  clearGuestSessionToken,
} from "./guestSession";

export { readGuestSessionToken as getGuestSessionToken } from "./guestSession";
export { writeGuestSessionToken as setGuestSessionToken } from "./guestSession";
export { clearGuestSessionToken as clearGuestSessionState } from "./guestSession";
