function calcularRentabilidad(inversionAnual, anios, tasaInteres) {
    let saldo = 0;
    let historial = [];
    
    for (let i = 1; i <= anios; i++) {
        saldo = (saldo + inversionAnual) * (1 + tasaInteres);
        historial.push(`- Año ${i}: ${saldo.toFixed(2)}$`);
    }
    
    return historial;
}

const inversionAnual = 36; // Cantidad anual en dólares
const anios = 50; // Número de años
const tasaInteres = 0.05; // 5% de rentabilidad anual

const resultado = calcularRentabilidad(inversionAnual, anios, tasaInteres);
console.log("RENTABILIDAD ANUAL");
console.log(resultado.join("\n"));