import { Editor } from '~/src/Editor/Editor';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '~/src/theme';

function App() {
    return (
        <ChakraProvider theme={theme}>
            <div className="App">
                <Editor />
            </div>
        </ChakraProvider>
    );
}

export default App;
