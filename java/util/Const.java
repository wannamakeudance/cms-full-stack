package util;

public class Const {
    public static final String removeText = "Delete";
    public static final String isAdminText = "IsAdmin";
    public static final String articlesNumText = "TotalArticles";
    public static final String[] columnsNames = {"UserName", "FirstName", "LastName", "Birthday","Desc", Const.isAdminText, Const.articlesNumText, "Avatar", "AvatarPath", Const.removeText};
    public static final int rowHeight = 50;
    public static final int windowWidth = 1000;
    public static final int windowHeight = 600;
    public static final String BaseUrl = "http://localhost:3000";
    public static final String loginFailError = "Login failed! Please check your name and password : )";
    public static final String logoutFailError = "Logout failed! Please try again : )";
    public static final String loginTips = "Please login the admins' username and password";
}
