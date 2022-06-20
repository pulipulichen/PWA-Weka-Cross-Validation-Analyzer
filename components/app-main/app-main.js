/* global ClipboardUtils */

let appMain = {
  data () {
    
    return {
      cacheKey: 'WekaCrossValidationAnalyzer',
      cacheAttrs: [],
      init: false,
      
      WekaResult: ''
    }
  },
  mounted () {
    this.dataLoad()
    this.loadDefaultWekaResult()

    this.inited = true
  },
  // components: {
    
  // },
  // watch: {
  // },
  computed: {
    extractInstancePart () {
      let posHeadNeedle = 'inst#,actual,predicted,error,prediction'
      let posFootNeedle = '=== Stratified cross-validation ==='

      let output = this.WekaResult

      let posHead = this.WekaResult.indexOf(posHeadNeedle)
      if (posHead > -1) {
        output = output.slice(posHead + posHeadNeedle.length).trim()
      }

      let posFoot = this.WekaResult.lastIndexOf(posFootNeedle)
      if (posFoot > -1) {
        output = output.slice(0, posFoot).trim()
      }

      return output
    },
    analysisTrails () {
      let instances = this.extractInstancePart.split('\n')

      let trails = []
      let trail = []
      for (let i = 0; i < instances.length; i++) {
        
        let parts = instances[i].split(',')
        if (parts.length === 1) {
          continue
        }

        if (parts[0] === '1' && trail.length > 0) {
          trails.push(trail)
          trail = []
        }

        let isError = 0
        if (parts[3] === '+') {
          isError = 1
        }
        trail.push(isError)
      }

      if (trail.length > 0) {
        trails.push(trail)
      }

      return trails
    },
    analysisTrailsErrorAvg () {
      return this.analysisTrails.map(trail => {
        return trail.reduce((a, b) => a + b, 0) / trail.length;
        // return trail.reduce((a, b) => a + b, 0)
        // return trail.length
      })
    },
    analysisTrailsTotalErrorAvg () {
      let total = []
      this.analysisTrails.forEach(trail => {
        total = total.concat(trail)
      })
      return (total.reduce((a, b) => a + b, 0) / total.length)
      // return total.reduce((a, b) => a + b, 0)
      // return total.length
    },
    AnalysisResult () {

      // return this.analysisTrailsErrorAvg.concat(this.analysisTrailsTotalErrorAvg).join('\n')
      return this.analysisTrailsErrorAvg.join('\n')
    }
  },
  methods: {
    dataLoad () {
      let projectFileListData = localStorage.getItem(this.cacheKey)
      if (!projectFileListData) {
        return false
      }
      
      projectFileListData = JSON.parse(projectFileListData)
      for (let key in projectFileListData) {
        this[key] = projectFileListData[key]
      }
    },
    dataSave () {
      if (this.inited === false) {
        return false
      }
      
      let keys = this.cacheAttrs
      
      let data = {}
      keys.forEach(key => {
        data[key] = this[key]
      })
      
      data = JSON.stringify(data)
      localStorage.setItem(this.cacheKey, data)
    },
    loadDefaultWekaResult () {
      if (this.WekaResult.trim() !== '') {
        return true
      }

      $.get('/data/20220613-2003.txt', (text) => {
        this.WekaResult = text
      })
    }
  }
}

module.exports = appMain