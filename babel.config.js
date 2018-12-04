export default function(api) {
    const env = api.env();

    const presets = [
        ['@babel/env', {
            targets: {
                node: 'current',
            },
            useBuiltIns: 'usage',
            modules: env == 'es6' ? false : 'commonjs',
        }],
    ];
    const plugins = [];

    return {
        presets,
        plugins,
    };
}
