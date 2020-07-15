
const home = (req, res) => {
  res.json({ msg: 'Welcome to the air quality API!' })
}

module.exports = {
  home,
}
