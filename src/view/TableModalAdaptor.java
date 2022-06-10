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
        switch (columnIndex) {
            case 0:
                return _data.get(rowIndex).getName();
            case 1:
                return _data.get(rowIndex).getLastName();
            case 2:
                return _data.get(rowIndex).getDateOfBirth();
            default:
                return "";
        }
    }

    @Override
    public void setValueAt(Object aValue, int rowIndex, int columnIndex) {
        super.setValueAt(aValue, rowIndex, columnIndex);
        User rowData = _data.get(rowIndex);

        switch (columnIndex) {
            case 0:
                rowData.setName((String) aValue);
                break;
            case 1:
                rowData.setBirthday((String) aValue);
                break;
            case 2:
                rowData.setFirstName((String) aValue);
                break;
            case 3:
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
