const axios = require('axios');
const fs = require('fs');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('importar-torneos')
    .setDescription('Obtendremos la lista actualizada de los torneos')
    .setDefaultPermission(false),

  /**
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async execute(interaction) {
    const url = 'https://raw.githubusercontent.com/Allavaz/iossa-stats/master/utils/Torneos.json';

    try {
      const response = await axios.get(url);
      const jsonData = response.data;

      fs.writeFileSync('Torneos.json', JSON.stringify(jsonData));

      // Mensaje de confirmación
      await interaction.reply('Se ha descargado y guardado el archivo Torneos.json correctamente.');
    } catch (error) {
      console.error('Error al descargar el archivo:', error);

      // Mensaje de error
      await interaction.reply('Ha ocurrido un error al intentar descargar el archivo Torneos.json.');
    }
  },
};
