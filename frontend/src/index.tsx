import './index.css';
import App from './App';
import { render } from 'preact';
import { ColorModeScript } from '@chakra-ui/react';
import { theme } from '~/src/theme';

render(
    <>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
    </>,
    document.body
);
