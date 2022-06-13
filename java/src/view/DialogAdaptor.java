package view;

import javax.swing.*;

public class DialogAdaptor {
    public DialogAdaptor(String text) {
        JDialog jDialog = new JDialog();
        JLabel jLabel = new JLabel(text);
        jDialog.add(jLabel);
        jDialog.setLocation(400, 50);
        jDialog.setSize(400, 100);
        jDialog.setVisible(true);
    }
}
