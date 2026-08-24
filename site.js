(function () {
  var FEATURES = {
    'vector-feature-custom-font-size': ['0', '1', '2'],
    'vector-feature-limited-width': ['1', '0'],
    'skin-theme': ['day', 'night', 'os']
  };
  var root = document.documentElement;
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem('tulupedia-prefs') || '{}'); } catch (e) {}

  function apply(feature, value) {
    FEATURES[feature].forEach(function (v) {
      root.classList.remove(feature + '-clientpref-' + v);
    });
    root.classList.add(feature + '-clientpref-' + value);
  }

  Object.keys(FEATURES).forEach(function (feature) {
    if (saved[feature] && FEATURES[feature].indexOf(saved[feature]) !== -1) {
      apply(feature, saved[feature]);
    }
    FEATURES[feature].forEach(function (value) {
      var input = document.getElementById('skin-client-pref-' + feature + '-value-' + value);
      if (!input) { return; }
      input.checked = root.classList.contains(feature + '-clientpref-' + value);
      input.addEventListener('change', function () {
        apply(feature, value);
        saved[feature] = value;
        try { localStorage.setItem('tulupedia-prefs', JSON.stringify(saved)); } catch (e) {}
      });
    });
  });
})();
