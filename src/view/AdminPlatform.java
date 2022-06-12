package view;

import util.Const;

import javax.swing.*;

public class AdminPlatform {
    public AdminPlatform() {
        JFrame jFrame = new JFrame("Users Admin Platform");
        JPanel jPanel = new JPanel();
        jPanel.setSize(Const.windowWidth, Const.windowHeight);
        new LoginForm(jPanel);
        jFrame.add(jPanel);
        jFrame.add(jPanel);
        jFrame.setSize(Const.windowWidth, Const.windowHeight);
        jFrame.setVisible(true);
    }
}
