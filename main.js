(function () {
  const ID_BOARD_ELEMENT = 'game-board'
  const ID_MOVES_CONTAINER= 'moves-container'
  const ID_RESTART_BUTTON = 'restart-button'
  const ID_TIMER = 'timer'
  const ID_OVERLAY = 'overlay'
  const CLASS_TILE_ELEMENT = 'tile'
  const CLASS_TILE_MATCHED = 'matched'
  const CLASS_TILE_REVEALED = 'revealed'
  const CLASS_OVERLAY_SHOW = 'show'

  const TILE_VISIBLE_DURATION = 900
  const TILE_COUNT = 14
  const tileData = []
  const defaultTileStatus = {
    matched: false
  }
  const selectedTiles = []
  let matchedCount = 0
  let movesCount = 0
  let timeElapsed = 0
  let timer = null

  const tileValues = ['🤩','😍','🥶','🦖','😈','👾','😜']
  const tileValuePairs = [...tileValues, ...tileValues]

  const shuffleArray = (arr) => {
    for (let i = 0; i < arr.length - 1; i++) {
      const j = Math.floor(Math.random() * (i + 1))
      const t = arr[i]
      arr[i] = arr[j]
      arr[j] = t
    }
    return arr
  }

  const init = () => {
    updateTimer()
    tileData.length = 0
    selectedTiles.length = 0
    matchedCount = 0

    updateMovesCount(0)
    shuffleArray(tileValuePairs)

    for(let i = 0; i < TILE_COUNT; i++) {
      tileData.push({id: i, value: tileValuePairs[i], ...defaultTileStatus })
    }
  }

  const hasWon = () => matchedCount === TILE_COUNT/2

  const updateTile = (tileId) => {
    const tileContent = makeTileContent(tileData[tileId])
    const tileElement = document.querySelector(`[data-tile-id="${tileId}"]`)
    tileElement.removeChild(tileElement.firstChild)
    tileElement.appendChild(tileContent)
    if(selectedTiles.includes(tileId)) {
      tileElement.classList.add(CLASS_TILE_REVEALED)
    } else {
      tileElement.classList.remove(CLASS_TILE_REVEALED)
    }
    if(tileData[tileId].matched) {
      tileElement.classList.add(CLASS_TILE_MATCHED)
      tileElement.classList.add(CLASS_TILE_REVEALED)
    }
  }

  const updateMovesCount = (count) => {
    movesCount = count !== undefined ? count : ++movesCount
    document.getElementById(ID_MOVES_CONTAINER).innerText = `Moves: ${movesCount}`
  }

  const handleTileClick = (e) => {
    if(timeElapsed === 0) {
      startTimer()
    }

    if(!hasWon()) {
      const tileId = Number(e.target.dataset.tileId)
      const tile = tileData[tileId]

      if((selectedTiles.length === 1 && selectedTiles[0] === tileId) || tile.matched) {
        return
      }
      
      updateMovesCount()
      
      selectedTiles.push(tileId)
      updateTile(tileId)
      
      if(selectedTiles.length === 2) {
        const [tile1, tile2] = selectedTiles
        const selectedTile1Value = tileData[tile1].value
        const selectedTile2Value = tileData[tile2].value

        if(selectedTile1Value === selectedTile2Value) {
          tileData[tile1].matched = true
          tileData[tile2].matched = true
          matchedCount++

          selectedTiles.length = 0
          updateTile(tile1)
          updateTile(tile2)

          if(hasWon()) {
            //window.alert('You win')
            toggleModal()
            stopTimer()
          }
        } else {
          selectedTiles.length = 0
          window.setTimeout(() => {
            updateTile(tile1)
            updateTile(tile2)
          }, TILE_VISIBLE_DURATION)
        }
      }
    }
  }

  const handleRestart = () => {
    if(!hasWon() && movesCount > 0) {
      const confirmation = window.confirm("Are you sure you want to restart?")
      if(confirmation) {
        initGame()
      }
    } else {
      initGame()
    }
  }


  const makeTileContent = (tile) => {
    const isTileRevealed = selectedTiles.includes(tile.id) || tile.matched
    return document.createTextNode(isTileRevealed ? tile.value : '?')
  }

  const removeAllChildNodes = (parent) => {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  const renderTiles = () => {
    const boardElement = document.getElementById(ID_BOARD_ELEMENT)
    removeAllChildNodes(boardElement)
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

  const formatMillisToTime = (millis) => {
    const totalSeconds = millis / 1000
    const minutes = Math.round(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const paddedMinutes = minutes < 10 ? `0${minutes}` :  `${minutes}`
    const paddedSeconds = seconds < 10 ? `0${seconds}` :  `${seconds}`
    return `${paddedMinutes}:${paddedSeconds}`
  }

  const startTimer = () => {
    if(!timer) {
      timer = window.setInterval(() => {
        timeElapsed += 1000
        const timerElement = document.getElementById(ID_TIMER)
        timerElement.innerHTML = formatMillisToTime(timeElapsed)
      },1000)
    }
  }

  const stopTimer = () => {
    if(timer) {
      window.clearInterval(timer)
      timer = null
    }
  }

  const updateTimer = () => {
    stopTimer()
    const timerElement = document.getElementById(ID_TIMER)
    timerElement.innerHTML = '00:00'
    timeElapsed = 0
  }

  const initGame = () => {
    init()
    renderTiles()
  }

  const setupEventHandlers = () => {
    document.getElementById(ID_RESTART_BUTTON).addEventListener('click', handleRestart)
    document.getElementById(ID_OVERLAY).addEventListener('click', toggleModal)
  }

  const toggleModal = () => {
    const modal = document.getElementById(ID_OVERLAY);
    if(modal.classList.contains(CLASS_OVERLAY_SHOW)) {
      modal.classList.remove(CLASS_OVERLAY_SHOW)
    } else {
      modal.classList.add(CLASS_OVERLAY_SHOW)
    }
  }
  
  setupEventHandlers()
  initGame()
})();
