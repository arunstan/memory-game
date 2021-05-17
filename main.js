(function () {
  const ID_BOARD_ELEMENT = 'game-board'
  const CLASS_TILE_ELEMENT = 'tile'

  const TILE_VISIBLE_DURATION = 700
  const TILE_COUNT = 14
  const tileData = []
  const defaultTileStatus = {
    matched: false
  }
  const selectedTiles = []

  const shuffleArray = (arr) => {
    for (let i = 0; i < arr.length - 1; i++) {
      const j = Math.floor(Math.random() * (i + 1))
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }

  const init = () => {
    for(let i = 0; i < TILE_COUNT; i++) {
      tileData.push({id: i, value: (i+1)%(TILE_COUNT/2), ...defaultTileStatus })
    }
  }

  const updateTile = (tileId) => {
    const tileContent = makeTileContent(tileData[tileId])
    const tileElement = document.querySelector(`[data-tile-id="${tileId}"]`)
    console.log(tileElement, tileContent)
    tileElement.removeChild(tileElement.firstChild)
    tileElement.appendChild(tileContent) 
  }

  const handleTileClick = (e) => {
    const tileId = e.target.dataset.tileId
    const tile = tileData[tileId]

    console.log(tileId, selectedTiles)

    if(selectedTiles.length && selectedTiles[0] === tileId) {
      return
    }
    
    selectedTiles.push(+tileId)
    updateTile(tileId)
    
    if(selectedTiles.length === 2) {
      const [tile1, tile2] = selectedTiles
      const selectedTile1Value = tileData[tile1].value
      const selectedTile2Value = tileData[tile2].value

      if(selectedTile1Value === selectedTile2Value) {
        tileData[tile1].matched = true
        tileData[tile2].matched = true
      } 

      selectedTiles.length = 0
      window.setTimeout(() => {
        updateTile(tile1)
        updateTile(tile2)
      }, TILE_VISIBLE_DURATION)
    }
  }


  const makeTileContent = (tile) => {
    console.log(tile, selectedTiles)
    const isTileRevealed = selectedTiles.includes(tile.id) || tile.matched
    return document.createTextNode(isTileRevealed ? tile.value : '?')
  }

  const initialRender = () => {
    const boardElement = document.getElementById(ID_BOARD_ELEMENT)
    for (let i = 0; i < TILE_COUNT; i++) {
      const tileContent = makeTileContent(tileData[i])
      
      const tileElement = document.createElement('div');
      tileElement.className = CLASS_TILE_ELEMENT;
      tileElement.dataset.tileId = i
      tileElement.onclick = handleTileClick
      tileElement.appendChild(tileContent)     
      
      boardElement.appendChild(tileElement)
    }
  }

  const initGame = () => {
    init()
    initialRender()
  }

  initGame()
})();
