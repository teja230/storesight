// Global ambient module declarations to satisfy TypeScript when
// using isolatedModules with only runtime JS deps.

declare module '@mui/material';
declare module '@mui/material/*';
declare module '@mui/material/styles';
declare module '@mui/icons-material/*';

declare module 'react-router-dom';

declare module 'date-fns';

// React typings are already provided via @types/react, but if eslint/tsserver
// complains in isolated files, ensure the React namespace exists.
import * as React from 'react';
export {};