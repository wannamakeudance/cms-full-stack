package view;

import util.Const;

import javax.swing.*;
import javax.swing.table.TableCellRenderer;
import java.awt.*;

public class TableCellButtonAdaptor implements TableCellRenderer {
    private static JButton jButton = new JButton(Const.removeText);

    @Override
    public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {
        return jButton;
    }
}
