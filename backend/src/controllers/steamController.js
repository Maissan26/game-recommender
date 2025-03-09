const getUserGames = async (req, res) => {
    const { steamId } = req.params;
    const API_KEY = process.env.STEAM_API_KEY;
  
    try {
      const response = await axios.get(
        `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/`,
        {
          params: {
            key: API_KEY,
            steamid: steamId,
            format: "json",
          },
        }
      );
      
      res.json(response.data.response);
    } catch (error) {
      res.status(500).json({ error: "Error fetching Steam games" });
    }
  };
  
  // Export using CommonJS
  module.exports = { getUserGames };  