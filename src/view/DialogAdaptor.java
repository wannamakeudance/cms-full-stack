package view;

import javax.swing.*;

public class DialogAdaptor {
    public DialogAdaptor(String text) {
        JDialog jDialog = new JDialog();
        jDialog.add(new JLabel(text));
        jDialog.setLocation(100, 20);
        jDialog.setSize(300, 100);
        jDialog.setVisible(true);
    }
}
