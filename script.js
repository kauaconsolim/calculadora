function insert(num){
    var numero=document.getElementById('table').value;
    document.getElementById('table').value=numero+num;
}
function clean(){
    document.getElementById('table').value="";
}
function back(){
    var resultado=document.getElementById('table').value;
    document.getElementById('table').value=resultado.substring(0,resultado.length-1);
}
function calcular(){
    var resultado=document.getElementById('table').value;
    if(resultado){
        document.getElementById('table').value=eval(resultado);
    }
    else{
        document.getElementById('table').value="Nada para calcular";
    }
}


