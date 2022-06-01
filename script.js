const $volver = document.querySelector(".volver");
const $otraVez = document.querySelector(".otraVez");
const $resultados = document.querySelector(".resultados");
const $calculo = document.getElementById("calculo");
const $penalizacion = document.getElementById("penalizacion");
let excesoJornada=4.25;

let onOff=function(boleano){
  for (let i=0;i<8;i++){
    $calculo[i].disabled=boleano
  }
}
let conversorHorasADiasyHoras = function (valor) {
  let dias = Math.trunc(valor),
    horas = Math.trunc((valor - dias) * 8),
    minutos = (valor*480) - (dias*480)- (horas*60)
    
    //minutos = Number.parseInt((((valor - dias) * 8) - Number.parseInt((valor - dias) * 8)) * 60)
    return {
    dias,
    horas,
    minutos
  }
}

document.addEventListener("click", e => {
  if (e.target === $calculo[7]) {
    e.preventDefault();
    for (let i=0;i<7;i++){
      if (isNaN($calculo[i].valueAsNumber) || $calculo[i].valueAsNumber<0){
        $resultados.innerHTML = ("Todos los campos deben ser numeros enteros positivos")
        return
      }
    }
    let msg1="";
    let msg2="";
    let minuendo={};
    let sustraendo={};
    //Calculo de la penalizacion sobre exceso jornada laboral por las bajas
    let pEJBaja = 0;
    if ($calculo[6].value <= 7) pEJBaja = 0;
    else if ($calculo[6].value <= 14) pEJBaja = 0.25 * excesoJornada;
    else if ($calculo[6].value <= 21) pEJBaja = 0.5 * excesoJornada;
    else if ($calculo[6].value <= 28) pEJBaja = 0.75 * excesoJornada;
    else pEJBaja = excesoJornada;

    let inicial={
      dias:Number.parseInt($calculo[0].value),
      horas:Number.parseInt($calculo[1].value),
      minutos:Number.parseInt($calculo[2].value)
    }
    let aRestar={
      dias:Number.parseInt($calculo[3].value),
      horas:Number.parseInt($calculo[4].value),
      minutos:Number.parseInt($calculo[5].value)
    }
    let totalInicial=(inicial.dias*8*60)+(inicial.horas*60)+(inicial.minutos);
    let totalARestar=(aRestar.dias*8*60)+(aRestar.horas*60)+(aRestar.minutos)+(pEJBaja*8*60);
    let penalizacion=conversorHorasADiasyHoras(pEJBaja)
    console.log(penalizacion)
 
    if (totalARestar>totalInicial){
      msg1="Este año ya no te quedan Vacaciones<br>Debes "
      msg2="del proximo año"
      minuendo={
        dias:aRestar.dias+penalizacion.dias,
        horas:aRestar.horas+penalizacion.horas,
        minutos:aRestar.minutos+penalizacion.minutos
      }
      sustraendo={
        dias:inicial.dias,
        horas:inicial.horas,
        minutos:inicial.minutos
      }
    }

    else {
      msg1="Te quedan "
      msg2="de vacaciones"
      minuendo={
        dias:inicial.dias,
        horas:inicial.horas,
        minutos:inicial.minutos
      }
      sustraendo={
        dias:aRestar.dias+penalizacion.dias,
        horas:aRestar.horas+penalizacion.horas,
        minutos:aRestar.minutos+penalizacion.minutos
      }

     }
     if (sustraendo.minutos>60){
      sustraendo.minutos-=60
      sustraendo.horas++
     }
     if (sustraendo.horas>8){
      sustraendo.horas-=8
      sustraendo.dias++
     }
     if (minuendo.minutos<sustraendo.minutos){
       minuendo.minutos+=60
       minuendo.horas--
     }
     if (minuendo.horas<sustraendo.horas){
      minuendo.horas+=8
      minuendo.dias--
    }
    onOff(true)
    $volver.hidden=false

    $penalizacion.innerHTML = (` ${penalizacion.dias} Días, ${penalizacion.horas} horas y ${penalizacion.minutos} minutos`)
    $resultados.innerHTML = (`${msg1}${minuendo.dias-sustraendo.dias} Días, ${minuendo.horas-sustraendo.horas} horas y ${minuendo.minutos-sustraendo.minutos} minutos ${msg2}<br><br> `)
    }
  }

)
document.addEventListener("click", e => {
  if (e.target === $otraVez) {
    e.preventDefault();
    onOff(false)
    for (let i=0;i<7;i++){
      $calculo[i].valueAsNumber=0
    }
    $penalizacion.innerHTML = (" ");
    $resultados.innerHTML = (" ");
    $volver.hidden=true
  }
})



/*const $resultados = document.querySelector(".resultados");
const $calculo = document.getElementById("calculo");
let excesoJornada=4.25;

let conversorHorasADiasyHoras = function (valor) {
  let dias = Number.parseInt(valor),
    horas = Number.parseInt((valor - dias) * 8),
    minutos = Number.parseInt((((valor - dias) * 8) - Number.parseInt((valor - dias) * 8)) * 60)
  if (minutos >= 60) {
    minutos -= 60;
    horas++
  }
  if (horas >= 8) {
    horas -= 8;
    dias++
  }
  return {
    dias,
    horas,
    minutos
  }
}

document.addEventListener("click", e => {
  if (e.target === $calculo[7]) {
    e.preventDefault();

    //Calculo de la penalizacion sobre exceso jornada laboral por las bajas
    let pEJBaja = 0;
    if ($calculo[6].value <= 7) pEJBaja = 0;
    else if ($calculo[6].value <= 14) pEJBaja = 0.25 * excesoJornada;
    else if ($calculo[6].value <= 21) pEJBaja = 0.5 * excesoJornada;
    else if ($calculo[6].value <= 28) pEJBaja = 0.75 * excesoJornada;
    else pEJBaja = excesoJornada;
    let penalizacionBaja = conversorHorasADiasyHoras(pEJBaja)

    // Resta final
    let minutosDespues = $calculo[2].value - $calculo[5].value - penalizacionBaja.minutos;
    let horasDespues = $calculo[1].value - $calculo[4].value - penalizacionBaja.horas;
    let diasDespues = $calculo[0].value - $calculo[3].value - penalizacionBaja.dias;
    
    if (minutosDespues < 0) {
      minutosDespues += 60;
      horasDespues--
    }
    if (horasDespues < 0) {
      horasDespues += 8;
      diasDespues--
    }
    $resultados.innerHTML = (`${diasDespues} Días, ${horasDespues} horas y ${minutosDespues} minutos <br><br> `)
  }

})

*/