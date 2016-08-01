/**
 * Get the display name for a React component
 * @param {Component} the React Component to get the display name for
 * @returns {string} display name
 */
export const getDisplayName = Component => {
    return Component.displayName || Component.name || 'Component'
};