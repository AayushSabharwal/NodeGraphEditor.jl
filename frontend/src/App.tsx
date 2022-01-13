import { ChakraProvider } from '@chakra-ui/react';
import Manager from '~/src/Manager';
import { theme } from '~/src/theme';

function App() {
    return (
        <ChakraProvider theme={theme}>
            <Manager/>
        </ChakraProvider>
    );
}

export default App;
