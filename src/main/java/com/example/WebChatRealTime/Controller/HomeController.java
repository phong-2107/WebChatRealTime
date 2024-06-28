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
    @GetMapping("/")
    public String Index(Model model){
        return  "Index";
    }

//
//    @GetMapping("/contact")
//    public String Contact(){
//        return  "Contact1/contact123";
//    }
//    @GetMapping("/Admin/Index")
//    public String Admin(){
//        return  "Admin/index";
//    }
//    @GetMapping("/Admin/Login")
//    public String Login(){
//        return  "Admin/pages-login";
//    }
//    @GetMapping("/Admin/tables-data")
//    public String ProductList(){
//        return  "Admin/tables-data";
//    }
//    @GetMapping("/Admin/product-manage")
//    public String ProductManage(){
//        return  "Admin/productManage";
//    }
//    @GetMapping("/test-socket")
//    public String SocketManage(){
//        return  "Admin/TestSocket";
//    }
}
