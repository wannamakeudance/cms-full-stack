package view;

import model.User;
import util.Const;

import javax.swing.table.AbstractTableModel;
import java.util.List;

public class TableModalAdaptor extends AbstractTableModel {
    private List<User> _data;
    private String[] _columnsNames = Const.columnsNames;
    public TableModalAdaptor(List<User> data) {
        this._data = data;
    }

    @Override
    public boolean isCellEditable(int rowIndex, int columnIndex) {
        return columnIndex < (this.getColumnCount() - 1);
    }

    @Override
    public int getRowCount() {
        return _data.size();
    }

    @Override
    public int getColumnCount() {
        return _columnsNames.length;
    }

    @Override
    public String getColumnName(int columnIndex) {
        return _columnsNames[columnIndex].toString();
    }

    @Override
    public Object getValueAt(int rowIndex, int columnIndex) {
        User row = _data.get(rowIndex);
        switch (columnIndex) {
            case 0:
                return row.getFullName();
            case 1:
                return row.getFirstName();
            case 2:
                return row.getLastName();
            case 3:
                return row.getDateOfBirth();
            case 4:
                return row.getAboutMeDescription();
            default:
                return "";
        }
    }

    @Override
    public void setValueAt(Object aValue, int rowIndex, int columnIndex) {

        User row = _data.get(rowIndex);
        switch (columnIndex) {
            case 0:
                row.setName(aValue.toString());
                break;
            case 1:
                row.setFirstName(aValue.toString());
                break;
            case 2:
                row.setLastName(aValue.toString());
                break;
            case 3:
                row.setDateOfBirth(aValue.toString());
                break;
            case 4:
                row.setAboutMeDescription(aValue.toString());
            default:
                break;
        }
    }

    /**
     * update the data of table model
     *
     * @param data the newest data of table
     */
    public void update(List<User> data) {
        _data = data;
        fireTableDataChanged();
    }
}
