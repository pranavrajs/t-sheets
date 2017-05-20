import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : '/dashboard',
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Cell = require('./container/CellContainer').default
      const reducer = require('./modules/cell').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'cellData', reducer })

      /*  Return getComponent   */
      cb(null, Cell)

    /* Webpack named bundle   */
    }, 'cellData')
  }
})
