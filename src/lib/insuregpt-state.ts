// InsureGPT open/close state bridge
// Uses the simplest possible mechanism: window global functions

type OpenHandler = () => void;
type CloseHandler = () => void;

let _openHandler: OpenHandler | null = null;
let _closeHandler: CloseHandler | null = null;

// Register handlers from the FloatingChatBot component
export function registerInsureGPTHandlers(onOpen: OpenHandler, onClose: CloseHandler) {
  _openHandler = onOpen;
  _closeHandler = onClose;
  // Also expose on window for maximum compatibility
  if (typeof window !== 'undefined') {
    (window as any).__insuregpt_open = onOpen;
    (window as any).__insuregpt_close = onClose;
  }
}

// Call from header button to open InsureGPT
export function openInsureGPT() {
  if (_openHandler) {
    _openHandler();
  } else if (typeof window !== 'undefined' && (window as any).__insuregpt_open) {
    (window as any).__insuregpt_open();
  }
}

// Call to close InsureGPT
export function closeInsureGPT() {
  if (_closeHandler) {
    _closeHandler();
  } else if (typeof window !== 'undefined' && (window as any).__insuregpt_close) {
    (window as any).__insuregpt_close();
  }
}
