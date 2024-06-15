<template>
  <div class="topBar" v-if="!showInputScreen">
    <!-- this part contain Add button, Year and Month select, and search/reset button -->
    <div class="button" @click="inputScreenSwitch()"> ADD </div>
    <p> | Start :</p>
    <select v-model="startTime.year">
      <option disabled value="">select year</option>
      <option v-for="(year, index) in searchOption.year" :key="index">{{ year }}</option>
    </select>
    <select v-model="startTime.month">
      <option disabled value="">select month</option>
      <option v-for="(month, index) in searchOption.month" :key="index">{{ month }}</option>
    </select>
    <div class="button" @click="search()"> Search </div>
    <div class="button" @click="reset()"> Reset </div>
  </div>

  <div class="summaryBar" v-if="!showInputScreen">
    <!-- this conrain whole database summary -->
    <div>
      Summary | In: {{ totalSummary.in.toFixed(2) }} | Out: {{ totalSummary.out.toFixed(2) }} | Total: {{ (totalSummary.in - totalSummary.out).toFixed(2) }}
    </div>
  </div>

  <div class="frame" v-if="!showInputScreen">
    <!-- this contain summary and data table and choose button -->
    <!-- switch bar -->
    <div class="switchBar">
      <div class="label" @click="summaryTable()">
        Summary
      </div>
      <div class="label" @click="dataTable()">
        Data
      </div>
    </div>
    <!-- data table -->
    <div class="table">
      <table class="summaryTable" v-if="showSummary">
        <tr>
          <th>Month</th>
          <th>In</th>
          <th>Out</th>
          <th>Total</th>
        </tr>
        <tr v-for="(summaryData,index) in summary" :key="index">
          <th>{{ index + 1 }}</th>
          <th>{{ summaryData.in.toFixed(2) }}</th>
          <th>{{ summaryData.out.toFixed(2) }}</th>
          <th>{{ (summaryData.in - summaryData.out).toFixed(2) }}</th>
        </tr>
      </table>
      <table class="dataTable" v-if="!showSummary">
        <tr>
          <th>Id</th>
          <th>Title</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Time</th>
        </tr>
        <tr v-for="row in data" :key="new Date(row.time)" @click="clickDataTable(row)">
          <th>{{ row.id }}</th>
          <th>{{ row.title }}</th>
          <th>{{ row.type }}</th>
          <th>{{ row.amount }}</th>
          <th>{{ row.time }}</th>
        </tr>
      </table>
    </div>
  </div>

  <div class="inputScreen" v-if="showInputScreen">
    <div class="button" @click="inputScreenSwitch()">X</div>
    <div> {{ error }}</div>
    <div> title: <input v-model="inputData.title"></div>
    <div> type:
      <input type="radio" id="in" value="in" v-model="inputData.type" />
      <label for="in">In</label>
      <input type="radio" id="out" value="out" v-model="inputData.type" />
      <label for="out">Out</label>
    </div>
    <div> Amount: $<input type="number" v-model="inputData.amount"></div>
    <div> Time:
      <input type="number" v-model="inputData.time.month" placeholder="MM" > /
      <input type="number" v-model="inputData.time.day" placeholder="dd" > /
      <input type="number" v-model="inputData.time.year" placeholder="YYYY" >
      <br/>
      <input type="number" v-model="inputData.time.hour" placeholder="HH" >:
      <input type="number" v-model="inputData.time.min" placeholder="mm" >
    </div>
    <div class="buttonList">
      <div class="button" v-if="isAdd" @click="addData">ADD</div>
      <div class="button" v-if="!isAdd" @click="editData()">Edit</div>
      <div class="button" v-if="!isAdd" @click="deleteData()">Delete</div>
    </div>
  </div>
</template>

<style scoped>
@import "./style/billPage.css";
</style>

<script>

export default {
  data () {
    return {
      server: 'http://10.0.0.100:3003',
      showInputScreen: false,
      searchOption: {
        year: [],
        month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      },
      startTime: {
        year: '',
        month: ''
      },
      totalSummary: {
        in: 0,
        out: 0
      },
      data: [],
      summary: [],
      showSummary: true,
      inputData: {
        id: 0,
        title: '',
        type: 'in',
        amount: 0,
        time: {
          year: 0,
          month: 0,
          day: 0,
          hour: 0,
          min: 0
        }
      },
      isAdd: true,
      error: ''
    }
  },
  methods: {
    /* For the input part */
    initInput () {
      this.inputData.id = 0
      this.inputData.title = ''
      this.inputData.type = 'in'
      this.inputData.amount = 0
      this.inputData.time.year = 0
      this.inputData.time.month = 0
      this.inputData.time.day = 0
      this.inputData.time.hour = 0
      this.inputData.time.min = 0
    },
    initSummary () {
      this.summary = []
      for (let i = 0; i < 12; i++) {
        this.summary.push({ in: 0, out: 0 })
      }
    },
    inputScreenSwitch () {
      this.showInputScreen = !this.showInputScreen
      this.initInput()
      this.isAdd = true
    },
    searchYear () {
      fetch(this.server + '/years')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then(data => {
          data.rows.forEach(row => {
            this.searchOption.year.push(row.year)
          })
        })
        .catch(error => {
          console.error('Error:', error)
        })
    },
    search () {
      if (this.startTime.year === '') {
        console.log('need to choose year')
      } else {
        if (this.startTime.month === '') {
          fetch(this.server + '/data/' + this.startTime.year + '/-1')
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok')
              }
              return response.json()
            })
            .then(data => {
              this.data = data.rows
              console.log(this.data)
            })
            .catch(error => {
              console.error('Error:', error)
            })
        } else {
          fetch(this.server + '/data/' + this.startTime.year + '/' + this.startTime.month)
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok')
              }
              return response.json()
            })
            .then(data => {
              this.data = data.rows
            })
            .catch(error => {
              console.error('Error:', error)
            })
        }
        fetch(this.server + '/summary/' + this.startTime.year)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok')
            }
            return response.json()
          })
          .then(data => {
            this.initSummary()
            data.rows.forEach(row => {
              if (row.type === 'out') {
                this.summary[row.month - 1].out = row.total_amount
              } else {
                this.summary[row.month - 1].in = row.total_amount
              }
            })
            console.log(this.summary)
          })
          .catch(error => {
            console.error('Error:', error)
          })
      }
    },
    reset () {
      this.startTime.year = ''
      this.startTime.month = ''
    },
    initTotalSummary () {
      fetch(this.server + '/summary')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then(data => {
          data.rows.forEach(row => {
            if (row.type === 'in') {
              this.totalSummary.in = row.total_amount
            } else {
              this.totalSummary.out = row.total_amount
            }
          })
        })
        .catch(error => {
          console.error('Error:', error)
        })
    },
    summaryTable () {
      this.showSummary = true
    },
    dataTable () {
      this.showSummary = false
    },
    clickDataTable (row) {
      this.inputData.id = row.id
      this.inputData.title = row.title
      this.inputData.type = row.type
      this.inputData.amount = row.amount
      const date = new Date(row.time)
      this.inputData.time.year = date.getFullYear()
      this.inputData.time.month = date.getMonth()
      this.inputData.time.day = date.getDate()
      this.inputData.time.hour = date.getHours()
      this.inputData.time.min = date.getMinutes()
      this.isAdd = false
      this.showInputScreen = true
    },
    addData () {
      if (this.inputData.title === '') {
        this.error = 'missing title'
      } else if (this.inputData.amount === 0) {
        this.error = 'missing amount'
      } else if (this.inputData.time.year === 0 | this.inputData.time.month === 0 | this.inputData.time.day === 0) {
        const date = new Date()
        this.inputData.time.year = date.getFullYear()
        this.inputData.time.month = (date.getMonth() + 1)
        this.inputData.time.day = date.getDate()
        this.inputData.time.hour = date.getHours()
        this.inputData.time.min = date.getMinutes()
        this.error = 'missing time'
      } else {
        this.error = 'success'
        fetch(this.server + '/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: this.inputData.type,
            title: this.inputData.title,
            amount: this.inputData.amount,
            time: this.inputData.time.year + '-' + this.inputData.time.month + '-' + this.inputData.time.day + ' ' + this.inputData.time.hour + ':' + this.inputData.time.min
          })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok')
            }
            return response.json()
          })
          .then(data => {
            if (data.rows.affectedRows === 1) {
              console.log('success' + data.rows)
              this.inputScreenSwitch()
            } else {
              console.log('fail')
            }
          })
          .catch(error => {
            console.error('Error:', error)
          })
      }
    },
    editData () {
      if (this.inputData.title === '') {
        this.error = 'missing title'
      } else if (this.inputData.amount === 0) {
        this.error = 'missing amount'
      } else if (this.inputData.time.year === 0 | this.inputData.time.month === 0 | this.inputData.time.day === 0) {
        const date = new Date()
        this.inputData.time.year = date.getFullYear()
        this.inputData.time.month = date.getMonth()
        this.inputData.time.day = date.getDate()
        this.inputData.time.hour = date.getHours()
        this.inputData.time.min = date.getMinutes()
        this.error = 'missing time'
      } else {
        this.error = 'success'
        fetch(this.server + '/data', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: this.inputData.id,
            type: this.inputData.type,
            title: this.inputData.title,
            amount: this.inputData.amount,
            time: this.inputData.time.year + '-' + this.inputData.time.month + '-' + this.inputData.time.day + ' ' + this.inputData.time.hour + ':' + this.inputData.time.min
          })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok')
            }
            return response.json()
          })
          .then(data => {
            if (data.rows.affectedRows === 1) {
              console.log('success' + data.rows)
              this.inputScreenSwitch()
              this.search()
              this.initTotalSummary()
            } else {
              console.log('fail')
            }
          })
          .catch(error => {
            console.error('Error:', error)
          })
      }
    },
    deleteData () {
      if (this.inputData.title === '') {
        this.error = 'missing title'
      } else if (this.inputData.amount === 0) {
        this.error = 'missing amount'
      } else if (this.inputData.time.year === 0 | this.inputData.time.month === 0 | this.inputData.time.day === 0) {
        const date = new Date()
        this.inputData.time.year = date.getFullYear()
        this.inputData.time.month = date.getMonth()
        this.inputData.time.day = date.getDate()
        this.inputData.time.hour = date.getHours()
        this.inputData.time.min = date.getMinutes()
        this.error = 'missing time'
      } else {
        this.error = 'success'
        fetch(this.server + '/data', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: this.inputData.id,
            title: this.inputData.title
          })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok')
            }
            return response.json()
          })
          .then(data => {
            if (data.rows.affectedRows === 1) {
              console.log('success' + data.rows)
              this.inputScreenSwitch()
              this.search()
              this.initTotalSummary()
            } else {
              console.log('fail')
            }
          })
          .catch(error => {
            console.error('Error:', error)
          })
      }
    }
  },
  created () {
    this.initSummary()
    this.initTotalSummary()
    this.initInput()
    this.searchYear()
  }
}

</script>
