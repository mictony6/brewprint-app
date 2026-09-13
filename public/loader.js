(function () {
    var ORIGIN = 'https://brewprint-app.pages.dev';
    var ENTRY = 'index.html';
    var MOUNT_ID = 'brewprint-root';

    // Make sure the mount div exists (in case the snippet only includes this script)
    var mount = document.getElementById(MOUNT_ID);
    if (!mount) {
        mount = document.createElement('div');
        mount.id = MOUNT_ID;
        document.currentScript.parentNode.insertBefore(mount, document.currentScript);
    }

    // Reserve the app's height synchronously so elements after it (e.g. the
    // Webflow footer) don't render into the empty div's spot and then jump
    // once the real CSS/JS load asynchronously below.
    mount.style.minHeight = '100dvh';

    // External <link> tags (fonts, etc.) live only in index.html's <head>,
    // so they're never part of the Vite manifest. The build extracts them
    // into head-links.json; replay them here, as early as possible, so
    // index.html stays the only place that needs editing when fonts change.
    fetch(ORIGIN + '/head-links.json', { cache: 'no-store' })
        .then(function (res) { return res.ok ? res.json() : []; })
        .then(function (links) {
            links.forEach(function (l) {
                var link = document.createElement('link');
                link.rel = l.rel;
                link.href = l.href;
                if (l.crossorigin) link.crossOrigin = l.crossorigin;
                document.head.appendChild(link);
            });
        })
        .catch(function (err) {
            console.error('[Brewprint loader] head-links', err);
        });

    // Fetch the manifest fresh every time
    fetch(ORIGIN + '/.vite/manifest.json', { cache: 'no-store' })
        .then(function (res) {
            if (!res.ok) throw new Error('Manifest fetch failed: ' + res.status);
            return res.json();
        })
        .then(function (manifest) {
            var entry = manifest[ENTRY];
            if (!entry) throw new Error('Entry not found in manifest: ' + ENTRY);

            // Inject CSS first so the app never renders unstyled
            (entry.css || []).forEach(function (href) {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = ORIGIN + '/' + href;
                document.head.appendChild(link);
            });

            // Then the JS bundle
            var script = document.createElement('script');
            script.type = 'module';
            script.src = ORIGIN + '/' + entry.file;
            document.head.appendChild(script);
        })
        .catch(function (err) {
            console.error('[Brewprint loader]', err);
        });
})();