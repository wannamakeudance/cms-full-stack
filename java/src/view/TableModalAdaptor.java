package view;

import model.User;
import util.Const;

import javax.swing.*;
import javax.swing.table.AbstractTableModel;
import java.awt.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

public class TableModalAdaptor extends AbstractTableModel {
    private List<User> _data;
    private String[] _columnsNames = Const.columnsNames;
    public TableModalAdaptor(List<User> data) {
        this._data = data;
    }

    @Override
    public boolean isCellEditable(int rowIndex, int columnIndex) {
        return false;
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
            case 5:
                return row.getUserRole();
            case 6:
                return row.getArticlesCreated();
            case 7:
                try {
                    ImageIcon imageIcon = new ImageIcon(new URL(Const.BaseUrl + row.getAvatarPath()));
                    ImageIcon newImageIcon = new ImageIcon(imageIcon.getImage().getScaledInstance(40, 40, Image.SCALE_SMOOTH));
                    return newImageIcon;
                } catch (MalformedURLException e) {
                    e.printStackTrace();
                }
            case  8:
                return row.getAvatarPath();
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

    @Override
    public Class<?> getColumnClass(int columnIndex) {
        return columnIndex == 7 ? ImageIcon.class : super.getColumnClass(columnIndex);
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
