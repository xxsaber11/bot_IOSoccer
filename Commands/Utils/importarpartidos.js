const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const axios = require("axios");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("importar-partidos")
    .setDescription("Importar el nuevo JSON disponible para los partidos")
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewChannel),

  async execute(interaction) {
    const url = "https://iosoccer-sa.bid/api/partidos";
    const filePath = "ListasDePartidos/partidos.json";
    const lobbyChannelId = "713573151971213322"; // Reemplaza con el ID del canal "lobby"

    try {
      // Función para descargar y procesar el JSON
      const importarPartidos = async () => {
        try {
          // Realizar la solicitud HTTP y descargar el archivo JSON
          const response = await axios.get(url);
          const jsonData = response.data;

          // Leer el archivo JSON existente
          let existingData;
          try {
            const existingDataString = fs.readFileSync(filePath, "utf8");
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

            // Guardar el archivo JSON actualizado
            fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

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
      console.error("Error al obtener partidos de forma automática:", error);
    }
  },
};
