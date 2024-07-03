package com.example.WebChatRealTime.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/")
public class HomeController {
    public HomeController(){

    }
    @GetMapping("/login")
    public String Login(){
        return  "user/login";
    }
    @GetMapping("/register")
    public String register(){
        return  "user/register";
    }

}
