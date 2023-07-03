const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const axios = require("axios");
const fs = require("fs");

// Importar la función execute() del archivo partido.js
const partido = require("../DatosDeJuego/partido.js");
const partidoExecute = partido.execute;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("importar-partidos")
    .setDescription("Importar el nuevo JSON disponible para los partidos")
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewChannel),

  async execute(interaction) {
    try {
      const url = "https://iosoccer-sa.bid/api/partidos";
      const existingFilePath = "ListasDePartidos/partidos.json";
      let counter = 0;

      const importarPartidos = async () => {
        try {
          // Realizar la solicitud HTTP y descargar el archivo JSON
          const response = await axios.get(url);
          const jsonData = response.data;

          // Leer el archivo JSON existente
          let existingData;
          try {
            const existingDataString = fs.readFileSync(existingFilePath, "utf8");
            existingData = JSON.parse(existingDataString);
          } catch (error) {
            console.log("No se encontró el archivo JSON existente. Se creará uno nuevo.");
            existingData = [];
          }

          // Verificar si hay nuevos partidos
          const newMatches = jsonData.filter((match) => !existingData.some((existingMatch) => existingMatch._id === match._id));

          if (newMatches.length > 0) {
            // Agregar los nuevos partidos al archivo JSON existente
            existingData.push(...newMatches);

            // Guardar el archivo JSON actualizado (sobrescribir el archivo existente)
            fs.writeFileSync(existingFilePath, JSON.stringify(existingData, null, 2));

            // Generar un archivo para los partidos recién actualizados
            const newFilePath = `ListasDePartidos/partidos_Recientes.json`;

            // Guardar los nuevos partidos en un archivo JSON diferente
            fs.writeFileSync(newFilePath, JSON.stringify(newMatches, null, 2));

            console.log("Se ha guardado el archivo JSON actualizado:", existingFilePath);
            console.log("Se ha guardado el archivo JSON de los nuevos partidos:", newFilePath);
          } else {
            if (counter === 50) {
              console.log("No hay nuevos partidos para importar.");
              counter = 0; // Reiniciar el contador

              // Ejecutar la función execute() del archivo partido.js
              await partidoExecute(interaction);
            } else {
              counter++;
            }
          }
        } catch (error) {
          console.error("Error al importar los partidos:", error);
        }
      };

      // Ejecutar la función inicialmente
      await importarPartidos();

      // Establecer un temporizador para ejecutar la función cada 5 segundos
      const interval = setInterval(importarPartidos, 5000);
    } catch (error) {
      console.error("Error al importar los partidos:", error);
    }
  },
};
