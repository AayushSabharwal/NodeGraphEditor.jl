import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export type EditorSlice = {
    selected_id: number
}

const initialState: EditorSlice = {
    selected_id: -1
};

export const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        setSelected(state, { payload: id }: PayloadAction<number>) {
            state.selected_id = id;
        }
    }
});

export const { setSelected } = editorSlice.actions;

export const idSelector = () => (state: RootState) => state.editor.selected_id;
