// ------------------------------------
// Constants
// ------------------------------------
export const SELECT_COL = 'SELECT_COL'
export const EDIT_COL = 'EDIT_COL'
export const CLEAR_EDIT = 'CLEAR_EDIT'
export const UPDATE_CELL_DATA = 'UPDATE_CELL_DATA'
// Insert Row
export const INSERT_COL = 'INSERT_COL'
export const DELETE_COL = 'DELETE_COL'
// Delete Row
export const INSERT_ROW = 'INSERT_ROW'
export const DELETE_ROW = 'DELETE_ROW'

function processNewState (x, y, cell, data) {
  const row = [...data[x].slice(0, y), cell, ...data[x].slice(y + 1)]
  return [...data.slice(0, x), row, ...data.slice(x + 1)]
}
// ------------------------------------
// Actions
// ------------------------------------
// Cell Operations
export function selectCol ({ x, y }) {
  return {
    type    : SELECT_COL,
    payload : {
      x,
      y,
    }
  }
}

export function editCol ({ x, y, attr }) {
  return {
    type    : EDIT_COL,
    payload : {
      x,
      y,
      attr
    }
  }
}

export function clearEdit () {
  return {
    type    : CLEAR_EDIT,
  }
}

export function updateCellData (attr) {
  return {
    type    : UPDATE_CELL_DATA,
    payload : {
      ...attr
    }
  }
}


// Col Actions
export function insertCol (index, dir) {
  return {
    type: INSERT_COL,
    payload: {
      index,
      dir
    }
  }
}

export function deleteCol (index) {
  return {
    type: DELETE_COL,
    payload: {
      index,
    }
  }
}


// Row Actions
export function insertRow (index, dir) {
  return {
    type: INSERT_ROW,
    payload: {
      index,
      dir
    }
  }
}

export function deleteRow (index) {
  return {
    type: DELETE_ROW,
    payload: {
      index,
    }
  }
}

const ACTION_HANDLERS = {

  // Cell Operations
  [SELECT_COL]: (state, action) => state + action.payload,
  [EDIT_COL]: (state, action) => {
    const { payload } = action
    const { data } = state
    // Remove selection from currentlySelected
    const cell = {
      ...data[payload.x][payload.y],
      ...payload.attr,
    }
    const newCellData = processNewState(payload.x, payload.y, cell, data)
    return {
      currentlySelected: {
        x: payload.x,
        y: payload.y,
      },
      data: newCellData
    }
  },
  [CLEAR_EDIT]    : (state, action) => {
    const { data, currentlySelected } = state
    if (currentlySelected.x === -1) return state
    // Remove selection from currentlySelected
    const cell = {
      ...data[currentlySelected.x][currentlySelected.y],
      isSelected: false,
      contentEditable: false,
    }
    const newCellData = processNewState(currentlySelected.x, currentlySelected.y, cell, data)
    return {
      currentlySelected: {
        x: -1,
        y: -1,
      },
      data: newCellData
    }
  },
  [UPDATE_CELL_DATA]: (state, action) => {
    const { payload } = action
    const { data, currentlySelected } = state
    if (currentlySelected.x === -1) return state
    // Remove selection from currentlySelected
    const cell = {
      ...data[currentlySelected.x][currentlySelected.y],
      ...payload,
    }
    const newCellData = processNewState(currentlySelected.x, currentlySelected.y, cell, data)
    return {
      currentlySelected,
      data: newCellData
    }
  },

  // Col Operations
  [INSERT_COL]: (state, action) => {
    const { payload } = action
    const { index, dir } = payload
    const data = []
    const posToInsert = dir === 'left' ? index : index + 1
    state.data.forEach((el) => {
      data.push([...el.slice(0, posToInsert), cellData, ...el.slice(posToInsert)])
    })

    return {
      ...state,
      data
    }
  },
  [DELETE_COL]: (state, action) => {
    const { payload } = action
    const { index } = payload
    const data = []
    state.data.forEach((el) => {
      data.push([...el.slice(0, index), ...el.slice(index + 1)])
    })

    return {
      ...state,
      data
    }
  },

  // Row Operations
  [INSERT_ROW]: (state, action) => {
    const { payload } = action
    const { index, dir } = payload
    const posToInsert = dir === 'up' ? index : index + 1
    const colLength = state.data[0].length
    const data = [
      ...state.data.slice(0, posToInsert),
      new Array(colLength).fill(cellData),
      ...state.data.slice(posToInsert)
    ]
    return {
      ...state,
      data
    }
  },
  [DELETE_ROW]: (state, action) => {
    const { payload } = action
    const { index } = payload
    const data = [
      ...state.data.slice(0, index),
      ...state.data.slice(index + 1)
    ]
    return {
      ...state,
      data
    }
  }
}

const cellData = {
  bold: false,
  italics: false,
  underline: false,
  value: '',
  isExpression: false,
  expression: '',
  isSelected: false,
  contentEditable: false,
}

const initialState = {
  currentlySelected: {
    x: -1,
    y: -1
  },
  data: new Array(40).fill(new Array(10).fill(cellData))
}

export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
