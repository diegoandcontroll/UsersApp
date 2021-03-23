class UserController{
    constructor(formIdCreate,formIdUpdate,tableEl){
        //Seleciona o form
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableEl);

        this.onSubmit();
        this.onEdit();
        this.selectAll();
    }

    onEdit(){
        document.querySelector("#box-user-update .btn-cancel").addEventListener('click',(e) =>{

        this.showPainelCreate();

        });

        this.formUpdateEl.addEventListener("submit", (e) =>{
            e.preventDefault();

            let btn = this.formUpdateEl.querySelector("[type=submit]");

            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            let index = this.formUpdateEl.dataset.trIndex;

            let tr = this.tableEl.rows[index];

            let userOld =  JSON.parse(tr.dataset.user);

            let dataResult = Object.assign({}, userOld, values);

            this.getPhoto(this.formUpdateEl).then( 
                (content) =>{
                    if(!values.photo){
                        dataResult._photo = userOld._photo;
                    }else{
                        dataResult._photo = content;
                    }
                    let user = new User();

                    user.loadFromJson(dataResult);
                    user.save();
                    this.getTr(user, tr);

                    this.updateCount();

                    this.formUpdateEl.reset();
                            
                    btn.disabled = false;

                    this.showPainelCreate();

            
            },
                (error) =>{
                alert("Error ao carregar photo");
            });


        });
    }
    onSubmit(){
        this.formEl.addEventListener("submit",(e) =>{

            e.preventDefault();

            let btn = this.formEl.querySelector("[type=submit]");

            btn.disabled = true;

            let values = this.getValues(this.formEl);

            if(!values) return false;

            this.getPhoto(this.formEl).then( 
                (content) =>{
                    values.photo = content;

                    values.save();

                    this.addLine(values);

                    this.formEl.reset();
                    
                    btn.disabled = false;

            
            },
                (error) =>{
                alert("Error ao carregar photo");
            });
            
        });
    }

    getPhoto(formEl){
        //criando uma promisse
        return new Promise( (resolve,reject) =>{
            
            let fileReader = new FileReader();

            let element = [...formEl.elements].filter(item =>{
                if(item.name === 'photo'){
                    return item;
                }
            })
            let file = element[0].files[0];
            fileReader.onload = () =>{
                resolve(fileReader.result);
            };
            
            fileReader.onerror = (error) =>{
                reject(error);
            }
            if(file){
                fileReader.readAsDataURL(file);
            }else{
                resolve('dist/img/avatar04.png');
            }
            });
        
    }

    

    
    // func para pegar os dados do form
    getValues(formEl){

        let user = {};
        let isValid = true;
        //percorre todos os elementos do form
        [...formEl.elements].forEach((field,index)=>{

            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){
                field.parentElement.classList.add('has-error');
                isValid = false;
            }
            if(field.name == 'gender'){
                if(field.checked){
                    user.gender = field.value;
                }
            }else if(field.name == 'admin'){
                user[field.name] = field.checked;
            }else{
                user[field.name] = field.value;
            }
        });

        if(!isValid){
            return false
        }
        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin);

        
    }
    
    selectAll(){
        let users = User.getUsersStorage();

        users.forEach(dataUser =>{
            let user = new User();

            user.loadFromJson(dataUser);

            this.addLine(user);
        });
    }
    //insertStorage(values){
        //let users = this.getUsersStorage();
        //users.push(values);
        //localStorage.setItem("users",JSON.stringify(users));
    //}
    addLine(values){

        let tr = this.getTr(values);

        this.tableEl.appendChild(tr);

        this.updateCount();
        
    }

    getTr(values, tr = null){
        if(tr === null) tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(values);

        tr.innerHTML = `
            <tr>
                <td>
                <img src="${values.photo}" alt="User Image" class="img-circle img-sm">
                </td>
                <td>${values.name}</td>
                <td>${values.email}</td>
                <td>${(values.admin) ? "Sim" : "Não"}</td>
                <td>${Utils.dateFormat(values.register)}</td>
                <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
                </td>
        </tr>
        `;

        this.addEventTr(tr);

        return tr;
    }

    addEventTr(tr){

        tr.querySelector(".btn-delete").addEventListener('click', (e) =>{
            if(confirm("How to Delete?")){

                let user = new User();

                user.loadFromJson( JSON.parse(tr.dataset.user));

                user.remove();
                tr.remove();
                this.updateCount();
            }
        });


        tr.querySelector(".btn-edit").addEventListener('click', (e)=>{
            let json = JSON.parse(tr.dataset.user);

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            for(let name in json){
                let field = this.formUpdateEl.querySelector("[name="+ 
                name.replace("_", "") +"]");
                if(field){
                    switch(field.type){
                        case 'file':
                            continue;
                        break;

                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name="+ 
                            name.replace("_", "") +"][value="+
                            json[name]+"]"
                            );

                            field.checked = true;
                        break;

                        case 'checkbox':
                            field.checked = json[name];
                        break;

                        default:
                            field.value = json[name];
                    }
                    
                    
                }
            }
            this.formUpdateEl.querySelector(".photo").src = json._photo;
            this.showPainelUpdate();
        });
    }

    showPainelCreate(){
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
    }

    showPainelUpdate(){
        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
    }
    updateCount(){
        let numbersUser = 0;
        let numbersAdmin = 0;

        [...this.tableEl.children].forEach(tr =>{
            
            numbersUser++;

           
            let user = JSON.parse((tr.dataset.user));

            if(user._admin) numbersAdmin++;
        });

        document.querySelector("#numbers-users").innerHTML = numbersUser;
        document.querySelector("#numbers-admin").innerHTML = numbersAdmin;
    }
}