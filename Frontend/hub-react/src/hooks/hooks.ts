import {
    useDispatch,
    useSelector,
    type TypedUseSelectorHook,
} from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";

/**
 * useAppDispatch
 * Typed version of useDispatch for AppDispatch (so thunks & actions are correctly typed)
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * useAppSelector
 * Typed version of useSelector that knows your RootState shape
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
