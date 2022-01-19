import './index.css';
import App from './App';
import { render } from 'preact';
import { ColorModeScript } from '@chakra-ui/react';
import { theme } from '~/src/theme';
import { Provider } from 'react-redux';
import store from './lib/store';

render(
    <>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Provider store={store}>
            <App />
        </Provider>
    </>,
    document.body
);
