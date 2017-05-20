import { connect } from 'react-redux'
import Home from '../components/HomeView'
import { editCol, clearEdit, updateCellData } from '../modules/cell'

const mapStateToProps = (state) => ({
  cellData : state.cellData.data,
  currentSelection: state.cellData.currentlySelected
})

const bindActions = {
  editCol,
  clearEdit,
  updateCellData,
}

export default connect(mapStateToProps, bindActions)(Home)
