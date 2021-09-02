class app_class
{
    constructor(url)
    {
        this.url = url;
    }

    get_url_index()
    {
        return this.url.split('?').shift();
    }

    get_value_form()
    {
        return this.url.split('?').pop().split('=').pop();
    }

    get_url_module()
    {
        return this.url.split('/')[2];
    }

    get_url_id()
    {
        return this.url.split('/').pop();
    }

    get_modules(link)
    {
        var modules = [
            {
              name: 'Dashboard',
              link: 'dashboard',
              icon: 'tachometer-alt'
            },
            {
              name: 'Sản Phẩm',
              link: 'product',
              icon: 'shopping-cart'
            },
            {
              name: 'Thành Viên',
              link: 'user',
              icon: 'user'
            }
        ];

        var str='<nav class="mt-2"><ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">';

        var active='';

        modules.forEach(e=>{
            // xét active
            active = ( link.indexOf(e.link) == -1 ) ? '' : 'active';

            str+=`<li class="nav-item">
                <a href="admin/`+e.link+`/index" class="nav-link `+active+`">
                    <i class="nav-icon fas fa-`+e.icon+`"></i>
                    <p>`+e.name+`</p>
                </a>
            </li>`;
        })

        str+='</ul></nav>';

        return str;
    }

    get_infoUser()
    {
        var str='';

        str+=`<div class="user-panel mt-3 pb-3 mb-3 d-flex">
            <div class="image">
                <img src="dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image">
            </div>
            <div class="info">
                <a href="#" class="d-block">Alexander Pierce</a>
            </div>
        </div>`;

        return str;
    }

    get_infoAdmin()
    {
        var str='';

        str+=`<a href="dashboard/index" class="brand-link">
            <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3"
                style="opacity: .8">
            <span class="brand-text font-weight-light">Admin</span>
        </a>`;

        return str;
    }

    get_sidebar()
    {
        var str='<aside class="main-sidebar sidebar-dark-primary elevation-4">';
        
        str += this.get_infoAdmin();
        str += '<div class="sidebar">';
        str += this.get_infoUser();

        str += this.get_modules(this.url);
        
        str += '</div></aside>';

        return str;
    }

    get_str_button_add_data(name_module)
    {
        var str;

        str = '<h3 class="card-title">';
        str+= '<a href="admin/'+name_module+'/add">';
        str+= '<small><i class="fas fa-plus"></i></small> Add';
        str+= '</a></h3>';

        return str;
    }

    button_add_data()
    {
        return this.get_str_button_add_data(this.get_url_module());
    }

    get_str_input_type_text(name, key)
    {
        var str;

        str='<div class="form-group">';
            str+='<label for="'+key+'">'+name+'</label>';
            str+='<input type="text" class="form-control" id="'+key+'" name="'+key+'" placeholder="Nhập '+name+'">';
        str+='</div>';

        return str;
    }

    get_str_form_categories()
    {
        var form='';

        form += this.get_str_input_type_text('Tên', 'name');
        form += this.get_str_input_type_text('Tên Đăng Nhập', 'username');

        return form;
    }

    show_table_data(data=[], name_module='')
    {
        var str=`<table class="table table-hover">
            <thead>
            <tr>
                <th>STT</th>
                <th>Tên Đăng Nhập</th>
                <th>Ngày Tạo</th>
                <th>Kích Hoạt</th>
                <th width="12%"><i class="fas fa-cog"></i></th>
            </tr>
            </thead>
            <tbody>`;
            
            var i=0;

            data.forEach(e=>{ i++;

                // checked status
                var checked=(e.status == true) ? 'checked':'';

                str+=`<tr id="id_tr_delete_`+e._id+`">
                    <td>`+i+`</td>
                    <td>`+e.username+`</td>
                    <td>`+e.date_created+`</td>
                    <td><input type="checkbox" id="status_`+e._id+`" onclick="js_status('`+e._id+`')" `+ checked +`></td>
                    <td>
                        <a href="admin/`+name_module+`/edit/`+e._id+`">
                            <i class="fas fa-edit"></i>
                        </a>
                        &nbsp;
                        <a href="javascript:;" data-toggle="modal" data-target="#modal-default" onclick="popup('`+e._id+`')">
                            <i class="fas fa-trash text-danger"></i>
                        </a>
                    </td>
                </tr>`;
            });

        str+=`</tbody></table>`;

        return str;
    }

    replace_field(name)
    {
        var kq='';

        switch (name)
        {
            case 'name': kq='Tên'; break;
            case 'username': kq='Tên Đăng Nhập'; break;
            case 'password': kq='Mật Khẩu'; break;
            case 'email': kq='E-mail'; break;
            case 'phone': kq='Điện Thoại'; break;

            default: kq='Chưa Xác Định'; break;
        }

        return kq;
    }

    show_form(data=[], name_module='', id_hidden='')
    {
        var str=`<form action="" role="form" id="submitForm"><div class="card-body">`;
        
        // phân biệt cái nào thêm, cái nào chỉnh sửa
        str+=`<input type="hidden" id="id_hidden" value="`+id_hidden+`">`;

        data.forEach(e=>{

            var name_replace = this.replace_field(e.name);

            var asterisks = (e.required == 'required') ? '<span class="text-danger">*</span>' : '';

            if(e.element == 'input')
            {
                str+=`<div class="form-group">
                    <label for="`+e.name+`">`+ name_replace + asterisks +`</label>
                    <input type="`+e.type+`" class="form-control" id="`+e.name+`" placeholder="Nhập `+name_replace+`" value="`+e.value+`" `+e.disabled+`>
                    <span class="err err_`+e.name+`"></span>
                </div>`;
            }

        });
            
        str+=`</div><div class="card-footer">
            <button type="submit" class="btn btn-primary">Lưu Lại</button>
            <a href="admin/`+name_module+`/index" class="btn">Thoát</a>
        </div>`;

        str+=`</form>`;

        return str;
    }

    get_form_search(value='')
    {
        return `<form action="" method="GET">
        <div class="input-group input-group-sm" style="width: 150px;">
          <input type="text" name="name" class="form-control float-right" value="`+value+`" placeholder="Nhập từ khóa..." required>
          <div class="input-group-append">
            <button type="submit" class="btn btn-default"><i class="fas fa-search"></i></button>
          </div>
        </div>
      </form>`;
    }

    str_pagination(totalPage=0, name_module='', page=0)
    {
        var vl_active=1;
        vl_active= (page == '') ? 1 : page;
        const pre = vl_active - 1;
        const next = pre + 2;

        // lùi về đầu trang
        var str='<li class="page-item">';
        str += '<a class="page-link" href="admin/'+ name_module + '/index">«</a></li>';
        // kết thúc lùi về đầu trang

        // lùi 1 trang
        str += '<li class="page-item">';
        str += '<a class="page-link" href="admin/'+ name_module + '/index/' + ((totalPage == 1)? '' : ((vl_active == 1)? 1 : pre)) +'"><i class="fa fa-angle-left" aria-hidden="true"></i></a>';
        str += '</li>';
        // kết thúc lùi 1 trang

        str += '<li><div>Trang '+ vl_active +'/'+ totalPage +'</div></li>';

        // tiến 1 trang
        str += '<li class="page-item">';
        str += '<a class="page-link" href="admin/'+ name_module + '/index/' + ((totalPage == 1)? '' : ((vl_active == totalPage)? totalPage : next )) +'"><i class="fa fa-angle-right" aria-hidden="true"></i></a>';
        str += '</li>';
        // kết thúc tiến 1 trang

        // tiến về cuối trang
        str += '<li class="page-item">';
        str += '<a class="page-link" href="admin/'+ name_module + '/index/'+ ((totalPage == 1)? '': totalPage) +'">»</a></li>';
        // kết thúc tiến về cuối trang

        return str;
    }
}

module.exports = app_class;