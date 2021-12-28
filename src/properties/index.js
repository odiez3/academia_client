export const URL_API = process.env.REACT_APP_TIPO && process.env.REACT_APP_TIPO === "local" ?
"http://localhost:3977/api" :"http://localhost:3977/api" 

console.log(URL_API);

export const PRICE_WEEKEND = 20.0; /*Precio a partir de Jueves*/ 
export const PRICE_MONTH = 350.0; /*Precio mensual*/
export const PRICE_LESSON = 25.0; /*Precio por clase*/
export const PRICE_WEEK = 100.0; /*Precio por semana*/

export const  CLASS_DAYS = [1, 2, 3];
export const WEKS_DAYS = [5,6,0];
export const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
export const DIAS = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"];
 
 export function validateEmail(email) {
     //var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
     return re.test(email);
 }


 export function  plantillaFecha(fecha) {
    let date = fecha;
    if (typeof fecha === "string") {

        if (fecha.trim() !== "") {
            try {
                date = new Date(fecha);
            } catch (error) {
                return "";
            }

        } else {
            return "";
        }

    }

    let mes = date.getMonth();
    //let dia = date.getDate();
    let dia = date.getDate();
    let anio = date.getFullYear();

    var weekday = new Array(7);
    weekday[0] = "Lunes";
    weekday[1] = "Martes";
    weekday[2] = "Miercoles";
    weekday[3] = "Jueves";
    weekday[4] = "Viernes";
    weekday[5] = "Sabado";
    weekday[6] = "Domingo";

    var month = new Array(12);
    month[0] = "Ene";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Abr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Ago";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dic";



    //return weekday[diaSemana] + " "+dia + " de " +month[mes] + " del " + anio;
    return dia + "/" + month[mes] + "/" + anio;

}