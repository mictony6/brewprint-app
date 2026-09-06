(function () {
    var ORIGIN = 'https://brewprint-app.pages.dev';
    var ENTRY = 'index.html';
    var MOUNT_ID = 'brewprint-root';

    // Make sure the mount div exists (in case the snippet only includes this script)
    if (!document.getElementById(MOUNT_ID)) {
        var mount = document.createElement('div');
        mount.id = MOUNT_ID;
        document.currentScript.parentNode.insertBefore(mount, document.currentScript);
    }

    // Font stylesheet isn't part of the Vite build/manifest, so inject it
    // the same way index.html does, and as early as possible.
    var preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect1);

    var preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect2);

    var fontStylesheet = document.createElement('link');
    fontStylesheet.rel = 'stylesheet';
    fontStylesheet.href = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap';
    document.head.appendChild(fontStylesheet);

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