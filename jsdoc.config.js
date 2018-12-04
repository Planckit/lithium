module.exports = {
    'plugins': ['plugins/markdown'],
    'templates': {
        'cleverLinks': false,
        'monospaceLinks': false,
    },
    'opts': {
        'destination': './docs/',
        'encoding': 'utf8',
        'private': true,
        'recurse': true,
        // 'template': './node_modules/minami',
        // 'template': 'node_modules/boxy-jsdoc-template',
        'template': 'node_modules/radgrad-jsdoc-template',
    },
};
