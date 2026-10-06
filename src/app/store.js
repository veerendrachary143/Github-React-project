import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import repositoryReducer from '../features/repositories/repositorySlice'
import rootSaga from './rootSaga'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: { repositories: repositoryReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)
