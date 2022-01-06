import './App.css';
import { Editor } from '~/src/Editor/Editor';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
    return (
        <ChakraProvider>
            <div className="App">
                <Editor />
            </div>
        </ChakraProvider>
    );
}

export default App;
