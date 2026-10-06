import { all, fork } from 'redux-saga/effects'
import repositorySaga from '../features/repositories/repositorySaga'

export default function* rootSaga() {
  yield all([fork(repositorySaga)])
}
