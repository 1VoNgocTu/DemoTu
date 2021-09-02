const express = require('express');
const router = express.Router();

// gọi bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

// gọi user_models
const user_models = require('../models/User');

// gọi app_class
const app_class = require('./app_class');
const kq = new app_class();

router.get('/index', async (req, res) =>{
    var sidebar, main, str_table, form_search, value_form='', name_module, obj_find;
    const kq = new app_class(req.originalUrl);
    obj_find = {trash: false};

    // tìm kiếm
    if(kq.get_value_form() != req.originalUrl)
    {
        obj_find = {trash: false, "username": { $regex: '.*' + kq.get_value_form() + '.*' } };
        value_form = kq.get_value_form();
    }

    buttonAddData   = kq.button_add_data();
    sidebar         = kq.get_sidebar();
    form_search     = kq.get_form_search(value_form);
    name_module     = kq.get_url_module();

    // ------- phân trang ---------

    // 1. Giới hạn bao nhiêu dữ liệu trên 1 trang: limit
    // 2. Vị trí của trang: page
    // 3. Vị trí bắt đầu trong database: skip

    let limit, page='', skip;

    limit=3; // skip = 0, 2, 4, 6
    page=req.params.pageIndex;
    skip=(page == '' || page == 1) ? 0 : (page-1)*limit;

    // 4. Tổng số dữ liệu : Giúp hiển thị số trang ngoài view
    let totalData = await user_models.find(obj_find);
    let totalPage = Math.ceil( totalData.length / limit );
    let str_pagination = kq.str_pagination(totalPage, name_module, page);
    // -------- kết thúc phân trang ---------

    user_models
    .find(obj_find)
    .limit(limit)
    .skip(skip)
    .sort({_id: -1})
    .exec((err, data)=>{
        if(err) res.send({kq:0, err:err});

        // gọi hàm và truyền data vào hàm
        str_table = kq.show_table_data(data, name_module);

        main = 'users/main_users';
        res.render('index', {main, sidebar, buttonAddData, str_table, name_module, form_search, str_pagination});
    });
});

router.get('/add', (req, res)=>{
    var sidebar, main;

    sidebar = kq.get_sidebar(req.originalUrl);

    // danh sách form
    var arr_form = [
        {name: 'name', element: 'input', type: 'text', required: 'required', value:'', disabled:''},
        {name: 'username', element: 'input', type: 'text', required: 'required', value:'', disabled:''},
        {name: 'password', element: 'input', type: 'password', required: 'required', value:'', disabled:''},
        {name: 'email', element: 'input', type: 'email', required: 'required', value:'', disabled:''},
        {name: 'phone', element: 'input', type: 'text', required: 'required', value:'', disabled:''}
    ];

    const name_module = kq.get_url_module(req.originalUrl);

    list_form = kq.show_form(arr_form, name_module);

    main = 'users/add_users';
    res.render('index', {main, sidebar, list_form, name_module});
});

router.get('/edit/:id', (req, res)=>{
    var sidebar, main;

    sidebar = kq.get_sidebar(req.originalUrl);

    // lấy _id
    const id = kq.get_url_id(req.originalUrl);

    user_models
    .find({_id: id})
    .exec((err, data)=>{
        if(err) res.send({kq:0, err:err});

        // danh sách form
        var arr_form = [
            {name: 'name', element: 'input', type: 'text', required: 'required', value:data[0].name, disabled:''},
            {name: 'username', element: 'input', type: 'text', required: 'required', value:data[0].username, disabled:''},
            {name: 'password', element: 'input', type: 'password', required: 'required', value:'******', disabled:'disabled'},
            {name: 'email', element: 'input', type: 'email', required: 'required', value:data[0].email, disabled:''},
            {name: 'phone', element: 'input', type: 'text', required: 'required', value:data[0].phone, disabled:''}
        ];

        const name_module = kq.get_url_module(req.originalUrl);

        list_form = kq.show_form(arr_form, name_module, id);

        var main = 'users/edit_users';

        res.render('index', {main, sidebar, list_form, name_module});
    });
});

router.post('/processForm', (req, res)=>{
    
    let name, username, password, email, phone, id_hidden;

    name=req.body.name;
    username=req.body.username;
    password=req.body.password;
    email=req.body.email;
    phone=req.body.phone;
    id_hidden=req.body.id_hidden;
    
    if(id_hidden=='')
    {
        // check username
        user_models
        .find({username})
        .exec((err, data)=>{
            if(err) res.send({kq:0, err});

            if(data=='')
            {
                // check email
                user_models
                .find({email})
                .exec((err, data)=>{
                    if(err) res.send({kq:0, err});

                    if(data=='')
                    {
                        // check phone
                        user_models
                        .find({phone})
                        .exec((err, data)=>{
                            if(err) res.send({kq:0, err});

                            if(data=='')
                            {
                                // thêm dữ liệu
                                bcrypt.genSalt(saltRounds, function(err, salt) {
                                    bcrypt.hash(password, salt, function(err, hash) {

                                        let obj={ name, username, password:hash, email, phone };

                                        user_models
                                        .create(obj, (err, data)=>{
                                            if(err) res.send({kq:0, err});

                                            res.send({kq:1, message:'ok', id_hidden});
                                        });

                                    });
                                });
                            }
                            else
                            {
                                res.send({kq:0, err:'Số Điện Thoại Đã Tồn Tại'});
                            }
                        });
                    }
                    else
                    {
                        res.send({kq:0, err:'Email Đã Tồn Tại'});
                    }
                });
            }
            else
            {
                res.send({kq:0, err:'Tên Đăng Nhập Đã Tồn Tại'});
            }
        });
    }
    else
    {
        // chỉnh sửa dữ liệu
        let obj={ name, username, email, phone };
        // check username

        // check email

        // check phone
        
        user_models
        .updateMany({_id: id_hidden}, obj, (err, data)=>{
            if(err) res.send({kq:0, err});

            res.send({kq:1, message:'ok', id_hidden});
        });
    }
});

router.post('/popup', (req, res)=>{
    const id=req.body.id;

    user_models
    .find({_id: id}, (err, data)=>{
        if(err) res.send({kq:0, err});

        res.send({kq:1, data:data[0]});
    })

});

router.post('/delete', (req, res)=>{
    const id=req.body.id;

    user_models
    .updateMany({_id: id}, {trash: true}, (err, data)=>{
        if(err) res.send({kq:0, err});

        res.send({kq:1, message: 'Đã xóa'});
    })

});

router.post('/status', (req, res)=>{
    const id=req.body.id;
    const value=req.body.value;

    //cập nhật status
    user_models
    .updateMany({_id: id}, {status: value}, (err, data)=>{
        if(err) res.send({kq:0, err});

        res.send({kq:1, message:'Đã cập nhật Status'});
    })

});

module.exports = router;