// storage-shim.js
// In the Claude preview, `window.storage` is provided for you. On your own
// deployed site it doesn't exist, so presets / ratings / accounts would
// silently fail to save. This shim recreates window.storage on top of the
// browser's localStorage so everything persists — PER BROWSER.
//
// Good for: a fast public demo, single-device use, showing the group.
// NOT enough for: real accounts that follow a person across phone + laptop,
// or the shared author-submission wall. For that, replace this with Supabase.
//
// HOW TO USE: paste this whole block at the very TOP of the inline <script>
// in index.html (and in spice-rack-authors.html), before any other code runs.

(function () {
  if (window.storage) return; // preview already provides it
  function k(key) { return 'spicerack:' + key; }
  window.storage = {
    async get(key) {
      var v = localStorage.getItem(k(key));
      if (v === null) throw new Error('not found'); // app expects a throw on missing keys
      return { key: key, value: v };
    },
    async set(key, value) {
      localStorage.setItem(k(key), value);
      return { key: key, value: value };
    },
    async delete(key) {
      localStorage.removeItem(k(key));
      return { key: key, deleted: true };
    },
    async list(prefix) {
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) {
        var raw = localStorage.key(i);
        if (raw && raw.indexOf('spicerack:') === 0) {
          var real = raw.slice('spicerack:'.length);
          if (!prefix || real.indexOf(prefix) === 0) keys.push(real);
        }
      }
      return { keys: keys };
    }
  };
})();
