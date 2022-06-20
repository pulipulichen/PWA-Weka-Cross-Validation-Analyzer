module.exports = {
  props: ['label', 'url'],
  methods: {
    copyURL (text) {
      navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!', text);
      }, function(err) {
        console.error('Async: Could not copy text: ', err);
      });
    }
  }
}