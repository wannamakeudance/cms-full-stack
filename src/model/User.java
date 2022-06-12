package model;

import java.util.LinkedHashMap;

public class User {
    private String UserName;
    private String FirstName;
    private String LastName;
    private String DateOfBirth;
    private String AboutMeDescription;
    private int UserRoleID;
    private int AvatarID;
    private int ArticlesCreated;
    private String CreatedDateTime;
    private String ModifiedDateTime;

    public User(LinkedHashMap hashMap) {
        UserName = (String) hashMap.get("UserName");
        FirstName = (String) hashMap.get("FirstName");
        LastName = (String) hashMap.get("LastName");
        DateOfBirth = (String) hashMap.get("DateOfBirth");
        AboutMeDescription = (String) hashMap.get("AboutMeDescription");
        UserRoleID = (Integer) hashMap.get("UserRoleID");
        AvatarID = (Integer) hashMap.get("AvatarID");
        ArticlesCreated = (Integer) hashMap.get("ArticlesCreated");;
        CreatedDateTime = (String) hashMap.get("CreatedDateTime");;
        ModifiedDateTime = (String) hashMap.get("ModifiedDateTime");;
    }

    public String getFirstName() {
        return FirstName;
    }

    public String getLastName() {
        return LastName;
    }

    public String getDateOfBirth() {
        return DateOfBirth;
    }

    public String getAboutMeDescription() {
        return  AboutMeDescription;
    }

    public String getFullName() {
        return UserName;
    }

    public void setName(String name) {
        UserName = name;
    }

    public void setFirstName(String firstName) {
        FirstName = firstName;
    }

    public void setLastName(String lastName) {
        LastName = lastName;
    }

    public void setDateOfBirth(String birthday) {
        DateOfBirth = birthday;
    }

    public void setAboutMeDescription(String aboutMeDescription) {
        AboutMeDescription = aboutMeDescription;
    }
}
