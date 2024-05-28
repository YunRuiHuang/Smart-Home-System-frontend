<template>
  <div class="page">
          <!-- TODO -->
          <!-- play music button and music status, need an larger button and clear view -->
          <p>{{ playing }}</p>
          <button @click="playmusic">turn on/off music</button><spam id="musicState">{{ musicState }}</spam>
      </div>
</template>

<script>

export default {
  data () {
    return {
      musicState: false,
      playing: 'Fetching music information...'
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
        })
        .catch(error => {
          console.error('Error:', error)
        })
    }

  },
  created () {
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
