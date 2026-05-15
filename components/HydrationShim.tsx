'use client';

// This shim runs immediately upon script evaluation on the client,
// before React hydration begins. It intercepts and filters out known
// console errors caused by browser extensions injecting attributes 
// (like 'rtrvr-ls' and 'rtrvr-ro') into the DOM.

if (typeof window !== 'undefined') {
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
        const msg = args[0];
        if (typeof msg === 'string') {
            // Check for common React hydration mismatch warnings related to attributes
            if (
                msg.includes('A tree hydrated but some attributes of the server rendered HTML didn\'t match') ||
                msg.includes('Hydration failed because the initial UI does not match') ||
                msg.includes('Warning: Expected server HTML to contain a matching') ||
                msg.includes('rtrvr-ls') ||
                msg.includes('rtrvr-ro')
            ) {
                // Ignore the error caused by the browser extension
                return;
            }
        }
        originalConsoleError.apply(console, args);
    };
}

export default function HydrationShim() {
    return null;
}
