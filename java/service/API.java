package service;

import util.Const;
import util.JSONUtils;

import java.io.IOException;
import java.net.CookieManager;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class API {

    private static API instance;
    private final String url = Const.BaseUrl;
    private final HttpClient client;
    private final CookieManager cookieManager;

    public static API getInstance() {
        if(instance == null) {
            instance = new API();
        }
        return instance;
    }

    public API() {
        this.cookieManager = new CookieManager();
        this.client = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .followRedirects(HttpClient.Redirect.NEVER)
                .connectTimeout(Duration.ofSeconds(10))
                .cookieHandler(this.cookieManager)
                .build();
    }

    public int login(String username, String password) throws IOException, InterruptedException {
        HashMap params = new HashMap();
        params.put("username", username);
        params.put("password", password);
        String json = JSONUtils.toJSON(params);
        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(Const.BaseUrl + "/api/login"))
                .setHeader("Content-Type", "application/json")
                .setHeader("Accept", "application/json")
                .method("POST", HttpRequest.BodyPublishers.ofString(json));

        HttpRequest request = builder.build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return  response.statusCode();
    }

    public int logout() throws IOException, InterruptedException {
        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(Const.BaseUrl + "/api/logout"))
                .setHeader("Content-Type", "application/json")
                .setHeader("Accept", "application/json")
                .method("GET", HttpRequest.BodyPublishers.noBody());

        HttpRequest request = builder.build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return  response.statusCode();
    }

    public int deleteUser(String username) throws IOException, InterruptedException {

        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(Const.BaseUrl + "/api/users/" + username))
                .setHeader("Content-Type", "application/json")
                .setHeader("Accept", "application/json")
                .method("DELETE", HttpRequest.BodyPublishers.noBody());

        HttpRequest request = builder.build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return  response.statusCode();
    }

    public List<Object> getUsersList() throws IOException, InterruptedException {

        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(url + "/api/users"))
                .setHeader("Accept", "application/json")
                .method("GET", HttpRequest.BodyPublishers.noBody());

        HttpRequest request = builder.build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String json = response.body();
        List<Object> users = new ArrayList<>();
        if (!json.equals("Unauthorized")) {
           users = JSONUtils.toList(json, Object.class);
        }
        return users;
    }
}
