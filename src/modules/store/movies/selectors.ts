import { State } from '../';
import * as local from './reducer';

const getLocalState = (state: State) => state.movies;

export const getAll = (state: State) => local.getAll(getLocalState(state));

export const getList = (state: State) => local.getList(getLocalState(state));