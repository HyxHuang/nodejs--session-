import usersView from '../views/users.art'
import httpModel from '../models/http'
class Users{
    constructor(){
        this.account = ''
        this.isLogin = false
        this.username = ''
        this.render()
    }
    async render(){
        //先判断一下是否为登录状态
        
        await this.auth()
        
        let html = usersView({
            username:this.username
        })
        $('.users').html(html)
        
        //隐藏注册登录界面
        $('.form-login').css('display','none')

        //登录按钮的点击事件
        $('.btn-login').on('click',function(){
            $('.form-login').css('display','none')
            $('.login').css('display','block')
            $('.tips').html('')
            
        })
        //登录提交按钮的点击事件
        $('.to-login').on('click',this.login.bind(this,'/api/users/login'))


        //注册按钮的点击事件
        $('.btn-register').on('click',function(){
            $('.form-login').css('display','none')
            $('.register').css('display','block')
            $('.tips').html('')
            
        }.bind(this))
        //注册提交按钮的点击事件
        $('.to-register').on('click',this.register.bind(this,'/api/users/register'))

        //退出按钮点击事件
        $('.exit').on('click',this.exit.bind(this))

        //取消按钮点击事件
        $('.cancel').on('click',function(){
            $('.form-login').css('display', 'none')
        })
       
        //侧边菜单的切换事件
        $('.fa-bars').click(function () {

            if ($('#sidebar > ul').is(":visible") === true) {
              $('#main-content').css({
                'margin-left': '0px'
              });
              $('#sidebar').css({
                'margin-left': '-210px'
              });
              $('#sidebar > ul').hide();
              $("#container").addClass("sidebar-closed");
            } else {
              $('#main-content').css({
                'margin-left': '210px'
              });
              $('#sidebar > ul').show();
              $('#sidebar').css({
                'margin-left': '0'
              });
              $("#container").removeClass("sidebar-closed");
            }
          });
    }
    async login(url){
        let data = $('#user-login').serialize()
        let result = await httpModel.get({
            url,
            type: 'POST',
            data
        })
        if(result.ret){
            this.handleLoginSucc(result)
            $('.form-login').css('display','none')
        }
        else{
            $('.tips-login').html(result.data.message)
        }
    }
    async register(url){
        let re = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if(re.test($('#user-register input[name="account"]').val())){
            if($('#user-register input[name=password]').val() == $('#user-register input[name=password-confirm]').val()){
                let data = $('#user-register').serialize()
                let result = await httpModel.get({
                    url,
                    type: 'POST',
                    data
                })
                
                this.handleRegisterSucc()
        
                $('.tips-register').html(result.data.message)
            }
            else{
                $('.tips-register').html('两次输入密码不一致')
            }
        }
        else{
            $('.tips-register').html('邮箱账号不合法')
        }
    }

    async exit(){
        let result = await httpModel.get({
            url: '/api/users/exit'
        })
        if(result.ret){
            this.render()
        }
    }

    handleRegisterSucc(){
        $('#user-register')[0].reset()
    }
    handleLoginSucc(result){
        $('#user-login')[0].reset()
        //重新渲染页面
        let html = usersView({
            username:result.data.username
        })
        $('.users').html(html)
        
        //注销按钮点击事件
        $('.exit').on('click',function(){
            this.render()
            this.account = ''
            this.isLogin = false
        }.bind(this))
    }

    //判断是否是登录状态
    async auth(){
        //初始化
        this.isLogin = false
        this.username = ''
        this.account = ''
        //然后再判断是否登录
        let result = await httpModel.get({
            url:'/api/users/isLogin'
        })
        if(result.ret){
            this.username = result.data.username
            this.account = result.data.account
            this.isLogin = true
        }
    }
    
}
export default new Users()
