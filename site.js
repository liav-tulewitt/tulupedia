(function () {
  var FEATURES = {
    'vector-feature-custom-font-size': ['0', '1', '2'],
    'vector-feature-limited-width': ['1', '0'],
    'skin-theme': ['day', 'night', 'os', 'tulu']
  };
  var root = document.documentElement;
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem('tulupedia-prefs') || '{}'); } catch (e) {}

  root.classList.add('client-js');

  function persist(key, value) {
    saved[key] = value;
    try { localStorage.setItem('tulupedia-prefs', JSON.stringify(saved)); } catch (e) {}
  }

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
        persist(feature, value);
      });
    });
  });

  // Pinnable sidebar panels (Appearance, Contents): "hide" moves the panel
  // into its collapsed header dropdown, "move to sidebar" moves it back.
  document.querySelectorAll('.vector-pinnable-header[data-feature-name]').forEach(function (header) {
    var feature = 'vector-feature-' + header.getAttribute('data-feature-name');
    var element = document.getElementById(header.getAttribute('data-pinnable-element-id'));
    var pinnedContainer = document.getElementById(header.getAttribute('data-pinned-container-id'));
    var unpinnedContainer = document.getElementById(header.getAttribute('data-unpinned-container-id'));
    var pinButton = header.querySelector('.vector-pinnable-header-pin-button');
    var unpinButton = header.querySelector('.vector-pinnable-header-unpin-button');
    if (!element || !pinnedContainer || !unpinnedContainer) { return; }

    function setPinned(pinned) {
      root.classList.remove(feature + '-clientpref-0', feature + '-clientpref-1');
      root.classList.add(feature + '-clientpref-' + (pinned ? '1' : '0'));
      header.classList.toggle('vector-pinnable-header-pinned', pinned);
      header.classList.toggle('vector-pinnable-header-unpinned', !pinned);
      (pinned ? pinnedContainer : unpinnedContainer).appendChild(element);
      persist(feature, pinned ? '1' : '0');
    }

    if (saved[feature] && saved[feature] !== (root.classList.contains(feature + '-clientpref-1') ? '1' : '0')) {
      setPinned(saved[feature] === '1');
    }

    if (unpinButton) { unpinButton.addEventListener('click', function () { setPinned(false); }); }
    if (pinButton) { pinButton.addEventListener('click', function () { setPinned(true); }); }
  });

  // Checkbox-driven dropdowns (main menu, appearance, language, user links, ...)
  // should close when the user clicks outside them or presses Escape.
  var dropdownCheckboxes = document.querySelectorAll('.vector-dropdown-checkbox');
  document.addEventListener('click', function (e) {
    dropdownCheckboxes.forEach(function (checkbox) {
      if (!checkbox.checked) { return; }
      var dropdown = checkbox.closest('.vector-dropdown');
      if (dropdown && !dropdown.contains(e.target)) {
        checkbox.checked = false;
      }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') { return; }
    dropdownCheckboxes.forEach(function (checkbox) { checkbox.checked = false; });
  });
})();
