/* # Manipulação Dom

document.querySelector('seletor')


var nome = document.querySelector('#exampleInputName');

//Filtandro com o querySelector

// document.querySelectorAll('#id|classe [name=nome]:filtro');

var birth = document.querySelector('#exampleInputBirth');

var country = document.querySelector('#exampleInputCountry');

var email = document.querySelector('#exampleInputEmail1');

var password = document.querySelector('#exampleInputPassword1');

var file = document.querySelector('#exampleInputFile');

var admin = document.getElementsByName('#admin');

*/

/* # Variaveis

var 

let 

const

*/


/* 
ForEach

let filds = document.querySelectorAll('#form-user-create [name]');

filds.forEach((arg, index)=>{
    console.log(arg.id, arg.name, arg.value);
});


*/

/*
If Else

let filds = document.querySelectorAll('#form-user-create [name]');

filds.forEach((arg, index)=>{
    if(arg.name == 'gender'){
        if(arg.checked){
            console.log('Sim', arg);
        }
    }else{
        console.log('Não');
    }
    
});

*/

let userController = new UserController("form-user-create", "form-user-update","table-users");









