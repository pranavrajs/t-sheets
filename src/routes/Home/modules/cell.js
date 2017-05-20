// ------------------------------------
// Constants
// ------------------------------------
export const SELECT_COL = 'SELECT_COL'
export const EDIT_COL = 'EDIT_COL'
export const CLEAR_EDIT = 'CLEAR_EDIT'
export const UPDATE_CELL_DATA = 'UPDATE_CELL_DATA'

function processNewState (x, y, cell, data) {
  const row = [...data[x].slice(0, y), cell, ...data[x].slice(y + 1)]
  return [...data.slice(0, x), row, ...data.slice(x + 1)]
}
// ------------------------------------
// Actions
// ------------------------------------
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

export const actions = {
  selectCol,
  editCol,
}

const ACTION_HANDLERS = {
  [SELECT_COL]    : (state, action) => state + action.payload,
  [EDIT_COL]    : (state, action) => {
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
  [UPDATE_CELL_DATA]    : (state, action) => {
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
  data: new Array(50).fill(new Array(50).fill(cellData))
}

export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
