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
    // Remove selection from currentSelection
    const cell = {
      ...data[payload.x][payload.y],
      ...payload.attr,
    }
    const newCellData = processNewState(payload.x, payload.y, cell, data)
    return {
      currentSelection: {
        x: payload.x,
        y: payload.y,
      },
      data: newCellData
    }
  },
  [CLEAR_EDIT]    : (state, action) => {
    const { data, currentSelection } = state
    if (currentSelection.x === -1) return state
    // Remove selection from currentSelection
    const cell = {
      ...data[currentSelection.x][currentSelection.y],
      isSelected: false,
      contentEditable: false,
    }
    const newCellData = processNewState(currentSelection.x, currentSelection.y, cell, data)
    return {
      currentSelection: {
        x: -1,
        y: -1,
      },
      data: newCellData
    }
  },
  [UPDATE_CELL_DATA]: (state, action) => {
    const { payload } = action
    const { data, currentSelection } = state
    if (currentSelection.x === -1) return state
    // Remove selection from currentSelection
    const cell = {
      ...data[currentSelection.x][currentSelection.y],
      ...payload,
    }
    const newCellData = processNewState(currentSelection.x, currentSelection.y, cell, data)
    return {
      currentSelection,
      data: newCellData
    }
  },

  // Col Operations
  [INSERT_COL]: (state, action) => {
    const { payload } = action
    const { index, dir } = payload
    const { currentSelection } = state
    const data = []
    // Find Place to Insert and update currently selected
    const posToInsert = dir === 'left' ? index : index + 1
    const y = dir === 'left' ? currentSelection.y + 1 : currentSelection.y
    state.data.forEach((el) => {
      data.push([...el.slice(0, posToInsert), cellData, ...el.slice(posToInsert)])
    })

    return {
      currentSelection: {
        x: currentSelection.x,
        y
      },
      data
    }
  },
  [DELETE_COL]: (state, action) => {
    const { payload } = action
    const { index } = payload
    const { currentSelection } = state
    const data = []

    // Reset currentSelection if y is in same column
    let y = index === currentSelection.y ? -1 : currentSelection.y
    // If greater decrement 1 else set same
    y = index < currentSelection.y ? currentSelection.y - 1 : y
    state.data.forEach((el) => {
      data.push([...el.slice(0, index), ...el.slice(index + 1)])
    })

    return {
      currentSelection: {
        x: currentSelection.x,
        y
      },
      data
    }
  },

  // Row Operations
  [INSERT_ROW]: (state, action) => {
    const { payload } = action
    const { index, dir } = payload
    const { currentSelection } = state
    // Find Place to Insert and update currently selected
    const posToInsert = dir === 'up' ? index : index + 1
    const x = dir === 'up' ? currentSelection.x + 1 : currentSelection.x
    // Update row
    const colLength = state.data[0].length
    const data = [
      ...state.data.slice(0, posToInsert),
      new Array(colLength).fill(cellData),
      ...state.data.slice(posToInsert)
    ]
    return {
      currentSelection: {
        x,
        y: currentSelection.y
      },
      data
    }
  },
  [DELETE_ROW]: (state, action) => {
    const { payload } = action
    const { index } = payload
    const { currentSelection } = state
    // Reset currentSelection if x is in same column
    let x = index === currentSelection.x ? -1 : currentSelection.x
    // If greater decrement 1 else set same
    x = index < currentSelection.x ? currentSelection.x - 1 : x

    // Update rows
    const data = [
      ...state.data.slice(0, index),
      ...state.data.slice(index + 1)
    ]
    return {
      currentSelection: {
        x,
        y: currentSelection.y
      },
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
  currentSelection: {
    x: -1,
    y: -1
  },
  data: new Array(40).fill(new Array(26).fill(cellData))
}

export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
