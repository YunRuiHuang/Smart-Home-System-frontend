<template>
  <div class="page">
          <!-- TODO -->
          <!-- play music button and music status, need an larger button and clear view -->
          <div class="head">
            <p>folder: {{ folder }}</p>
            <p>playing: {{ playing }}</p>
          </div>
          <div class="main">
            <div class="folderlist">
              <div class="folder" v-for="(folders, index) in folderList" :key="index" @click="changeFolder(folders)"> {{ folders }}</div>
            </div>
            <div class="buttonlist">
              <div class="button" id="playButton" @click="playmusic">{{ musicState }}</div>
              <div class="button" @click="update">update</div>
              <div class="button" @click="rand">rand</div>
              <div class="button" @click="playnext">next</div>
            </div>
            <!-- put the folder list here -->
          </div>
          <div class="musiclist">
            <!-- put the music list here -->
            <div class="music" v-for="(music, index) in musicList" :key="index" @click="addMusic(music)">{{ music }}</div>
          </div>
      </div>
</template>

<style>

.folderlist {
  display: flex;
  flex-direction: row;
  width: 80%;
  height: 80px;
  margin: 0px 10% 0px 10%;
  background-color: #4CAF50;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
}
.folder {
  display: flex;
  width: 20%;
  height: 100%;
  align-items: center;
  justify-content: center;
}
.folder:hover {
  background-color: #45a049;
}

.buttonlist {
  display: flex;
  flex-direction: row;
  width: 80%;
  height: 180px;
  margin: 10px 10% 10px 10%;
  align-items: center;
  justify-content: center;
}
.button {
  display: flex;
  width: 100px;
  aspect-ratio: 1 / 1;
  background-color: #4CAF50;
  border-radius: 50%;
  text-align: center;
  align-items: center;
  justify-content: center;
}
.button:hover {
  background-color: #45a049;
}
#playButton {
  width: 180px;
  aspect-ratio: 1 / 1;
}

.musiclist {
  height: 50%;
  overflow: auto;
}
.music {
  margin-top: 3px;
}
.music:hover {
  background-color: aqua;
}

@media(max-width:600px) {
  .button {
    width: 20%;
  }
  #playButton {
    width: 40%;
  }
}
</style>

<script>

export default {
  data () {
    return {
      musicState: false,
      updateState: false,
      folder: 'none',
      playing: 'Fetching music information...',
      folderList: [],
      musicList: []
    }
  },
  methods: {
    playmusic () {
      fetch('http://10.0.0.100:3002/status', { method: 'PUT' })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then(data => {
          this.musicState = data.playingState
          this.updateMusic()
        })
        .catch(error => {
          console.error('Error:', error)
        })
    },
    updateMusic () {
      fetch('http://10.0.0.100:3002/status')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then(data => {
          this.musicState = data.playingState
        })
        .catch(error => {
          console.error('Error:', error)
        })
      fetch('http://10.0.0.100:3002/playing')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then(data => {
          this.playing = data.playing
          this.folder = data.folder
        })
        .catch(error => {
          console.error('Error:', error)
        })
    },
    getMusicList () {
      fetch('http://10.0.0.100:3002/list')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then(data => {
          this.musicList = data.list
        })
        .catch(error => {
          console.error('Error:', error)
        })
    },
    getFolderList () {
      fetch('http://10.0.0.100:3002/folderlist')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then(data => {
          this.folderList = data.folders
        })
        .catch(error => {
          console.error('Error:', error)
        })
    },
    changeFolder (folderName) {
      fetch('http://10.0.0.100:3002/folder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folder: folderName
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          } else {
            this.folder = folderName
            this.getMusicList()
          }
        })
        .catch(error => {
          console.error('Error:', error)
        })
    },
    update () {
      fetch('http://10.0.0.100:3002/update', { method: 'PUT' })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then(data => {
          this.updateState = data.updateState
        })
        .catch(error => {
          console.error('Error:', error)
        })
    },
    rand () {
      fetch('http://10.0.0.100:3002/rand', { method: 'PUT' })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
        })
        .catch(error => {
          console.error('Error:', error)
        })
    },
    async playnext () {
      this.playmusic()
      await new Promise(resolve => setTimeout(resolve, 10000))
      this.playmusic()
    },
    addMusic (music) {
      fetch('http://10.0.0.100:3002/add', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          music: music
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
        })
        .catch(error => {
          console.error('Error:', error)
        })
    }

  },
  created () {
    this.getFolderList()
    this.getMusicList()
    this.updateMusic()
    this.interval = setInterval(() => {
      this.updateMusic()
    }, 15000)
  },
  beforeUnmount () {
    clearInterval(this.interval)
  }
}

</script>
