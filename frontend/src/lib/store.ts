import { configureStore } from "@reduxjs/toolkit";
import { editorSlice } from "./editorSlice";
import { graphSlice } from "./graphSlice";
import { viewportSlice } from "./viewportSlice";

const store = configureStore({
    reducer: {
        graph: graphSlice.reducer,
        editor: editorSlice.reducer,
        viewport: viewportSlice.reducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
