package view;

import service.API;
import util.Const;

import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.concurrent.ExecutionException;

public class LoginForm {

    private JPanel loginPanel;
    private TableAdaptor tableAdaptor;
    private JTextField usernameInput;
    private JTextField passwordInput;
    private JLabel usernameLabel;
    private JLabel passwordLabel;
    private JButton button;
    private final String loginStatus = "login";
    private final  String logoutStatus = "logout";
    private String username;
    private String password;
    public LoginForm(JPanel loginPanel) {

        this.loginPanel = loginPanel;

        usernameLabel = new JLabel("username");
        passwordLabel = new JLabel("password");
        usernameInput = new JTextField("");
        passwordInput = new JTextField("");
        button = new JButton("login");
        usernameInput.setColumns(15);
        passwordInput.setColumns(15);

        loginPanel.add(usernameLabel);
        loginPanel.add(usernameInput);
        loginPanel.add(passwordLabel);
        loginPanel.add(passwordInput);
        loginPanel.add(button);

        this.addEventListener();
    }

    private void addEventListener(){
        button.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String buttonText = button.getText();
                username = usernameInput.getText();
                password = passwordInput.getText();
                LoginAndLogoutWorker loginAndLogoutWorker = new LoginAndLogoutWorker(buttonText);
                loginAndLogoutWorker.execute();
            }
        });
    }

    public class LoginAndLogoutWorker extends SwingWorker<Integer, Void>{

        String _buttonText;
        Boolean _isLogin;

        public LoginAndLogoutWorker(String buttonText) {
            _buttonText = buttonText;
        }

        @Override
        protected Integer doInBackground() throws Exception {
            _isLogin = _buttonText.equals(loginStatus);

            int statusCode = _isLogin
                    ? API.getInstance().login(username, password)
                    :  API.getInstance().logout();


            return statusCode;
        }

        @Override
        protected void done() {
            super.done();
            String text = _isLogin ? logoutStatus : loginStatus;
            String errorMsg = _isLogin ? Const.loginFailError : Const.logoutFailError;
            try {
                if (get() == 204) {
                    usernameInput.setEnabled(!_isLogin);
                    passwordInput.setEnabled(!_isLogin);
                    button.setText(text);

                    if (_isLogin) {
                        tableAdaptor = new TableAdaptor(loginPanel);
                    } else {
                        tableAdaptor.removeScrollPaneForTable();
                    }
                } else {
                    new DialogAdaptor(errorMsg);
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (ExecutionException e) {
                e.printStackTrace();
            }
        }
    }
}
