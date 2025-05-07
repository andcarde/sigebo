function processAndSortString(input) {
    // Separar el string en un array por salto de línea
    const lines = input.split('\n');

    // Ordenar el array alfabéticamente por la primera palabra antes de ':'
    lines.sort((a, b) => {
        const keyA = a.split(':')[0].trim().toLowerCase();
        const keyB = b.split(':')[0].trim().toLowerCase();
        return keyA.localeCompare(keyB);
    });

    // Imprimir el array ordenado
    lines.forEach(line => console.log(line));
    console.log(`Cantidad de líneas: ${lines.length}`);
}

// Ejemplo de uso
const inputString = `banana: fruta amarilla
apple: fruta roja
cherry: fruta pequeña`;

const wineString = `
Vinificar: Proceso de transformación de la uva en vino mediante la fermentación y otras técnicas enológicas.
Fermentar: Conversión de los azúcares del mosto en alcohol y CO₂ por acción de levaduras.
Limpidez: Grado de claridad de un vino, sin partículas en suspensión ni turbidez.
Densidad de población: Número de cepas plantadas por hectárea en un viñedo, afectando su rendimiento y calidad.
Hectárea: Unidad de superficie equivalente a 10,000 m², usada para medir viñedos.
Parcela: Fracción de terreno dentro de un viñedo con características específicas de suelo y microclima.
Vid: Planta trepadora del género Vitis de la que se obtiene la uva para vinificación.
Cepa: Tronco y parte baja de la vid, desde donde brotan los sarmientos y hojas.
Viña: Terreno cultivado con vides para la producción de uva.
Portainjerto: Base de una vid resistente a plagas y enfermedades, sobre la que se injerta una variedad vinífera.
Clarificar: Proceso para eliminar partículas en suspensión en el vino, mejorando su limpidez.
Coupage: Mezcla de diferentes vinos o variedades de uva para lograr un perfil específico.
Variedad de uva: Tipo de vid con características propias de sabor, color y acidez en sus uvas.
Uva: Fruto de la vid, utilizado para producir vino, consumo en fresco o pasas.
Antociano: Pigmento natural en la piel de las uvas tintas que da color al vino.
Tanino: Compuesto fenólico presente en piel, semillas y madera, que aporta astringencia y estructura al vino.
Subproducto: Residuo obtenido tras la vinificación, como orujos, lías o vinazas.
Calidez del vino: Sensación de calor en boca provocada por el alcohol.
Frescura del vino: Sensación vibrante y ligera en boca, relacionada con la acidez.
Acidez del vino: Componente que aporta viveza, equilibrio y capacidad de envejecimiento.
Aroma del vino: Conjunto de olores percibidos en el vino, derivados de la uva, fermentación y crianza.
Estructura del vino: Sensaciones táctiles en boca relacionadas con cuerpo, acidez, taninos y alcohol.
Sabor del vino: Conjunto de percepciones gustativas y retronasales que definen su perfil en boca.
Tipo de uva: Clasificación de la uva según su variedad, uso (vinificación o mesa) y características.
Barrica: Recipiente de madera, generalmente de roble, utilizado para la crianza del vino.
Remontado: Técnica que consiste en bombear el mosto sobre el sombrero de hollejos para extraer color y taninos.
Trasiego: Proceso de transferir el vino de un recipiente a otro para eliminar sedimentos y oxigenarlo.
Embotellado: Última fase de la vinificación en la que el vino se envasa en botellas para su comercialización o crianza.
Etiquetado: Colocación de etiquetas en las botellas con información sobre el vino, como variedad, origen y añada.
Denominación de origen: Certificación que garantiza que un vino proviene de una región específica con características geográficas y de calidad determinadas.
Consejo regulador: Organismo encargado de velar por el cumplimiento de las normas y la calidad de los productos bajo una denominación de origen.
Grado alcohólico: Porcentaje de alcohol etílico presente en un vino, que indica su fuerza alcohólica.
Metabisulfito potásico: Compuesto usado como conservante en la vinificación para prevenir la oxidación y el crecimiento de bacterias.
Polifenoles: Compuestos antioxidantes presentes en las uvas y el vino, responsables de color, sabor y beneficios para la salud.
Ácido tartárico: Ácido principal en las uvas que contribuye a la acidez del vino y su estabilidad.
Ácido cítrico: Ácido presente en algunas uvas que aporta frescura y equilibrio en la acidez del vino.
Ácido subcínico: Ácido presente en pequeñas cantidades en el vino, relacionado con la acidez y algunos sabores.
Acidez total: Medida de la cantidad de ácidos presentes en un vino, influyendo en su frescura, equilibrio y capacidad de envejecimiento.
Densidad del vino: Medida de la concentración de sólidos disueltos en el vino, que indica su "peso" y potencial de contenido alcohólico.
MTUs del vino: Unidades de medida utilizadas para determinar la cantidad de sustancias aromáticas o compuestos en el vino, relacionadas con su calidad y complejidad.
Tonalidad del vino: Color del vino, influenciado por la variedad de uva, proceso de vinificación y crianza.
Ribete: El borde o contorno del vino en la copa, que muestra la intensidad del color y la evolución del vino (puede ser más claro o dorado en vinos envejecidos).
SO2 libre: Dióxido de azufre presente en el vino en su forma no combinada, utilizado como conservante y antioxidante para evitar la oxidación y el desarrollo de bacterias.
Aromas frutales: Olores derivados de la fruta en el vino, como manzana, cereza o frutos rojos, que provienen principalmente de la variedad de uva.
Aromas florales: Olores que recuerdan a flores, como jazmín, rosa o flor de azahar, y son típicos de algunas variedades de uva y su proceso de vinificación.
Aromas primarios: Aromas provenientes directamente de la uva, como los frutales y florales, y están relacionados con la variedad y el terroir.
Aromas secundarios: Aromas generados durante la fermentación y otros procesos enológicos, como los de levadura o fermentación, que aportan complejidad.
Aromas terciarios: Aromas desarrollados durante el envejecimiento del vino, ya sea en barrica o botella, como notas de cuero, tabaco, especias o madera.
Comercialización del vino: Proceso de distribución y venta del vino, que incluye el embalaje, la estrategia de marketing, la exportación y la promoción de la marca.
Producción del vino: Conjunto de procesos que abarcan la viticultura (cultivo de la vid), la vinificación (transformación de la uva en vino) y el embotellado.
Viticultura: Ciencia y arte de cultivar la vid, incluyendo la selección del terreno, el manejo del viñedo y la cosecha de uvas.
Enología: Ciencia que estudia la vinificación, es decir, el proceso de producción del vino, desde la cosecha de la uva hasta el embotellado.
Enologo: Profesional especializado en la producción de vino, encargado de supervisar todo el proceso de vinificación y asegurar la calidad del vino.
Analítica del vino: Conjunto de pruebas científicas realizadas para evaluar las características químicas y organolépticas del vino, como el pH, acidez, alcohol y compuestos aromáticos.
Puntos Parker: Sistema de calificación utilizado por el crítico de vino Robert Parker, que otorga una puntuación de 50 a 100 puntos para evaluar la calidad de un vino.
Corcho: Material natural obtenido de la corteza del alcornoque, utilizado para sellar las botellas de vino, preservando su calidad.
Duelas: Lamas de madera utilizadas para fabricar barricas de vino, que permiten la crianza y aportan sabores y aromas específicos al vino.
Bazukeado: Técnica de agitar o mover el vino en el depósito para asegurar una mejor extracción de los compuestos fenólicos, como los taninos, durante la fermentación.
Remontado: Proceso en el que el mosto es bombeado desde el fondo del tanque sobre el sombrero de los hollejos (pieles de uva) para extraer color, taninos y aromas.
Serpentín: Sistema de enfriamiento que consiste en un tubo en espiral a través del cual circula agua fría para enfriar el mosto o vino durante la fermentación.
Depósito de acero inoxidable: Recipiente utilizado para la fermentación y almacenamiento del vino, que permite un control preciso de la temperatura y evita la contaminación.
Defecto del vino: Cualquier imperfección en el vino que afecta su calidad, como olores o sabores indeseados (por ejemplo, vino a corcho o vino oxidado).
Color pajizo: Color amarillo pálido, generalmente asociado con vinos blancos jóvenes, como el Chardonnay o el Sauvignon Blanc.
Color cereza: Color rojo intenso que caracteriza a los vinos tintos jóvenes, especialmente aquellos elaborados con uvas como la Tempranillo o la Cabernet Sauvignon.
Color pálido: Color claro, generalmente asociado con vinos blancos o rosados jóvenes, que indica frescura y baja concentración de antocianos.
Envejecimiento: Proceso en el cual el vino evoluciona, ya sea en barrica o botella, desarrollando complejidad en sabor, aroma y textura con el paso del tiempo.
Maceración: Técnica en la que las pieles de las uvas se mantienen en contacto con el mosto para extraer color, taninos y aromas durante la fermentación.
Sumiller: Profesional del vino encargado de seleccionar, servir y recomendar vinos en restaurantes o establecimientos, con conocimientos profundos sobre vinos y maridajes.
Diferenciación: Proceso de destacar las características únicas de un vino o marca frente a otros en el mercado, a través de su origen, proceso de vinificación o perfil sensorial.
Corrección: Ajuste de las características del vino, como acidez, color o sabor, mediante técnicas de vinificación o aditivos para mejorar su calidad.
Sembrado: Acción de plantar las vides en el viñedo, determinando la disposición y densidad de las cepas para el desarrollo óptimo de la planta.
Sembrado de levaduras: Proceso de agregar levaduras seleccionadas al mosto para iniciar la fermentación alcohólica.
Levadura endógena: Levadura natural presente en las uvas y el ambiente del viñedo, que puede fermentar el mosto sin intervención externa.
Levadura exógena: Levadura añadida al mosto de forma artificial para controlar y asegurar la fermentación de manera eficiente y predecible.
Quiebra proteica: Descomposición de proteínas en el vino, que puede causar turbidez o "nubes" si no se controla durante el proceso de vinificación.
Parada fermentativa: Detención involuntaria o controlada de la fermentación, generalmente debido a factores como temperaturas bajas, falta de nutrientes o exceso de alcohol.
Ácidez volátil: Componente ácido (generalmente ácido acético) en el vino que, en exceso, puede generar olores desagradables y contribuir al desarrollo de vinagre.
Vinagre de vino: Producto obtenido por la oxidación del vino, donde las bacterias acéticas convierten el alcohol en ácido acético, transformando el vino en vinagre.
Cuerpo del vino: Sensación de peso y densidad del vino en boca, determinada por su contenido de alcohol, azúcar, glicerol y otros componentes. Puede ser ligero, medio o con cuerpo.
Calidez del vino: Sensación de calor en la boca provocada por el contenido alcohólico del vino. Los vinos con mayor graduación alcohólica suelen tener una mayor calidez.
Frescura del vino: Sensación de vivacidad y ligereza, generalmente asociada con una acidez equilibrada. Es una característica deseable en vinos jóvenes y frescos.
Astringencia del vino: Sensación de sequedad o aspereza en la boca, provocada principalmente por los taninos presentes en los vinos tintos. Contribuye a la estructura del vino.
Sedosidad del vino: Sensación suave y aterciopelada en boca, generalmente asociada con vinos bien equilibrados y una textura armoniosa, sin asperezas.
Peso del vino: Término que se refiere a la densidad del vino en boca, relacionado con su cuerpo. Un vino con más "peso" tiende a ser más robusto y denso.
Bretanomices: Levadura o microorganismo que, en ciertas condiciones, puede producir compuestos que aportan aromas y sabores indeseables, como "barniz" o "animales", conocidos como "brett".
Podredumbre de la uva: Descomposición de la uva debido a hongos o bacterias, que puede ser causada por factores climáticos o manejo inadecuado. La podredumbre noble (Botrytis cinerea) es deseada en algunos vinos dulces.
Mildiu: Enfermedad fúngica causada por el hongo Plasmopara viticola, que afecta a las hojas y racimos de la vid, produciendo manchas amarillas y retrasando el crecimiento de la planta.
Araña roja: Ácaro que afecta las vides, causando daños a las hojas, las cuales se vuelven amarillas y se secan, afectando la fotosíntesis y la salud de la planta.
Araña amarilla: Similar a la araña roja, pero más común en zonas cálidas. Provoca daños en las hojas de la vid, reduciendo su capacidad fotosintética y debilitando la planta.
Estrés de la vid: Condición en la que la planta no recibe las condiciones óptimas para su crecimiento, como falta de agua, temperaturas extremas o deficiencias nutricionales, lo que afecta la calidad de las uvas.
Pérdida en barrica: Pérdida de vino debido a la evaporación a través de la madera de la barrica, conocida como "parte de los ángeles". Esta pérdida puede afectar la cantidad final de vino disponible.
Fermentación maloláctica: Proceso en el cual el ácido málico del vino se convierte en ácido láctico, reduciendo la acidez y aportando suavidad y complejidad al vino.
Crianza: Período durante el cual el vino envejece, ya sea en barricas de madera o en botella, para desarrollar características organolépticas adicionales.
Oxidación: Reacción química que ocurre cuando el vino entra en contacto con el oxígeno, afectando su color, aroma y sabor. Puede ser controlada o no deseada dependiendo del tipo de vino.
Vino de guarda: Vino con características estructurales y de acidez que le permiten envejecer y mejorar con el tiempo en botella.
Vino joven: Vino que se consume poco tiempo después de la cosecha, sin envejecimiento prolongado en barrica o botella, manteniendo frescura y características frutales.
Filtración: Proceso en el que el vino se pasa a través de un material poroso (como filtros o membranas) para eliminar impurezas o partículas no deseadas.
Cata: Evaluación sensorial del vino que incluye la observación, olfacción y degustación para analizar su color, aroma, sabor y estructura.
Despalillado: Proceso de separar los raspón (palos) de las uvas antes de la fermentación, para evitar sabores amargos y mejorar la calidad del vino.
Pistonado: Técnica en la que se remueve el sombrero de hollejos (pulpas) que se forma durante la fermentación en depósitos, para mejorar la extracción de color, taninos y aromas.
Boca: Parte de la cata del vino que se refiere a las sensaciones que se perciben en la boca, como el sabor, la textura, la acidez, los taninos y el cuerpo del vino.
Aireación: Proceso de exponer el vino al aire para permitir que respire y se liberen sus aromas, lo cual puede mejorar sus características organolépticas.
Envero: Etapa en el ciclo de la vid cuando las uvas comienzan a cambiar de color, señalando el inicio de la maduración.
Macero: Persona o equipo responsable de la maceración en la vinificación, que supervisa el tiempo de contacto entre las pieles de la uva y el mosto para extraer color y taninos.
Puntuación de cata: Sistema de evaluación utilizado por catadores profesionales para puntuar el vino en diferentes aspectos, como color, aroma, sabor y estructura, a menudo expresado en una escala numérica.
Vino dulce: Vino con un alto contenido de azúcar residual, que puede ser el resultado de una interrupción de la fermentación o de uvas sobremaduradas o pasificadas.
Vino fortificado: Vino al que se le ha añadido alcohol destilado (generalmente brandy) para aumentar su contenido alcohólico y detener la fermentación, como en el caso del oporto o el jerez.
Refractómetro: Herramienta utilizada en enología para medir el contenido de azúcares en el mosto, lo que ayuda a determinar el momento adecuado para la cosecha.
Corte o coupage: Mezcla de diferentes vinos o variedades de uva para crear un vino con un perfil específico de sabor, aroma y estructura.
Deshidratación: Pérdida de agua en las uvas debido a factores climáticos, como la sequía, que puede concentrar azúcares y aromas, pero también afectar la calidad si es excesiva.
Maceración carbónica: Método de vinificación en el que las uvas enteras se fermentan en un ambiente saturado de dióxido de carbono, lo que resulta en un vino afrutado y poco tánico.
Lías: Restos de levaduras y otras partículas sólidas que quedan en el vino después de la fermentación y que, cuando se mantienen en contacto con el vino (sobre lías), pueden aportar complejidad y textura.
Prensado: Proceso de extraer el jugo de las uvas mediante presión, utilizado para obtener mosto en la vinificación de vinos blancos o rosados.
Vino crianza: Vino que ha pasado un tiempo determinado de envejecimiento, generalmente en barricas de madera y luego en botella, para desarrollar complejidad y madurez.
Microoxigenación: Técnica controlada que consiste en añadir pequeñas cantidades de oxígeno al vino durante la crianza para mejorar su suavidad, color y complejidad.
Vino de autor: Vino producido por un enólogo o productor que imprime su estilo personal en la vinificación, con el objetivo de crear un producto único y diferenciado.
Vino espumoso: Vino que contiene dióxido de carbono disuelto, lo que provoca burbujas cuando se abre la botella. Se obtiene mediante la fermentación en botella (método tradicional) o en tanque (método Charmat).
Temperatura de crianza: Control de la temperatura en el proceso de envejecimiento del vino, especialmente en barrica, que afecta la evolución de los compuestos aromáticos y la integración de sabores.
Cepa clonada: Variedad específica de una cepa de vid seleccionada y multiplicada a partir de un clon de una planta que tiene características deseables, como resistencia a enfermedades o producción elevada.
Vino de licor: Vino con un alto contenido de azúcar, generalmente dulce, que ha sido enriquecido con alcohol, como en el caso del vino de Porto o Madeira.
Vino de paja: Vino dulce producido mediante la deshidratación de las uvas en esteras o paja, lo que concentra sus azúcares antes de la fermentación, como en el caso de los vinos italianos de la región de Veneto.
Vino de mesa: Vino comúnmente consumido, que no tiene un nivel de calidad asociado a una denominación de origen. Generalmente es de precio accesible y se destina a consumo diario.
Mosto: Jugo de uvas recién exprimido que contiene azúcares y otros compuestos esenciales para la fermentación, antes de ser convertido en vino.
Rendimiento: Cantidad de vino que se obtiene de un viñedo o de una cosecha, generalmente expresado en litros de vino por hectárea. También puede referirse a la eficiencia de la vinificación.
Azúcares residuales: Azúcares que permanecen en el vino después de la fermentación, sin ser convertidos en alcohol. Son responsables de la dulzura del vino.
%vol: Abreviatura de "porcentaje de volumen", que indica la cantidad de alcohol etílico presente en un vino, expresada como un porcentaje en relación con el volumen total del vino.
Vino tánico: Vino que tiene una alta concentración de taninos, compuestos fenólicos presentes en las pieles, semillas y tallos de las uvas, que aportan una sensación de astringencia y estructura al vino, especialmente en los tintos.
Catador: Rol de persona especializada en la evaluación sensorial del vino. Utiliza el gusto, el olfato y la vista para analizar y calificar las características del vino, como su aroma, sabor y color.
Hollejo: Piel de la uva. Contiene muchos de los compuestos responsables del color, taninos y algunos aromas del vino, especialmente en los vinos tintos.
Pepitas: Semillas de la uva. Contienen taninos, aunque en menor concentración que los hollejos. A menudo se retiran durante la vinificación para evitar sabores amargos.
Organoléptico: Relativo a las características que pueden ser percibidas por los sentidos, como el aroma, sabor, textura y color del vino.
Poro de la barrica: Espacios microscópicos en la madera de la barrica a través de los cuales el vino entra en contacto con el aire, permitiendo la microoxigenación de este. Proceso que influye en la evolución y complejidad del vino durante su crianza.
Vino robusto: Vino con mucho cuerpo. Tiene una alta concentración de taninos, alcohol y otros componentes que le dan una estructura sólida y una sensación fuerte en boca.
Glicerol: Compuesto presente en el vino, resultado de la fermentación. Es un alcohol no etílico que contribuye a la textura del vino, aportando suavidad y una sensación ligeramente dulce.
Viñedo: Terreno donde se cultivan las vides para la producción de uvas. El viñedo incluye la elección de la variedad de uva, el manejo del cultivo y las condiciones ambientales que afectan la calidad de las uvas.
Maridaje: Combinación de un vino con alimentos de manera que se complementen entre sí, mejorando tanto el sabor del vino como el del plato. Un maridaje adecuado puede realzar las características sensoriales de ambos.
pH del vino: Medida de la acidez del vino. Un pH bajo indica mayor acidez, mientras que un pH alto señala menor acidez. El pH influye en el sabor, la estabilidad del vino y su capacidad de envejecimiento.
Pigmento: Componente responsable del color del vino, especialmente los antocianos en los vinos tintos, que se encuentran en la piel de las uvas y dan su color rojo o púrpura.
Variedad vinífera: Tipo de uva utilizado para producir vino. Existen miles de variedades, cada una con sus características específicas, como la Cabernet Sauvignon, Tempranillo o Chardonnay.
Marco de plantación: Disposición y distancia entre las plantas en un viñedo, que afecta el crecimiento de las vides, la producción de uvas y la calidad de la cosecha.
Alcohol etílico: El tipo de alcohol que se encuentra en el vino, resultado de la fermentación de los azúcares presentes en las uvas. Es el componente principal que le da al vino su contenido alcohólico.
Alcohol: Compuestos químico que contienen uno o más grupos hidroxilo (-OH) unidos a átomos de carbono.
Efecto psicoactivo del vino: Cambios en el estado mental y emocional causados por el etanol (alcohol etílico) presente en el vino. Este compuesto actúa como un depresor del sistema nervioso central, provocando sensaciones de relajación, euforia y desinhibición, pero en altas cantidades puede alterar la percepción, la coordinación y la capacidad cognitiva.
Vino seco: Vino con bajo contenido de azúcar residual, lo que significa que la fermentación ha convertido la mayoría de los azúcares en alcohol. Los vinos secos suelen tener menos de 4 gramos de azúcar por litro.
Vino semiseco: Vino con un contenido moderado de azúcar residual, que aporta una sensación ligeramente dulce en boca. Los vinos semisecos tienen entre 4 y 12 gramos de azúcar por litro.
Vino semidulce: Vino con un contenido moderado a alto de azúcar residual, que aporta una sensación dulce en boca. Los vinos semidulces tienen entre 12 y 45 gramos de azúcar por litro.
Vino dulce: Vino con un alto contenido de azúcar residual, que puede ser el resultado de una interrupción de la fermentación o de uvas sobremaduradas o pasificadas.
`;

processAndSortString(wineString);