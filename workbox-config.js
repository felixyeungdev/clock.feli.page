module.exports = {
    globDirectory: "build/",
    globPatterns: ["**/*.{html,css,png,js,json,ttf}"],
    globIgnores: ["**/404.html"],
    swDest: "build/sw.js",
    skipWaiting: true,
    clientsClaim: true,
    maximumFileSizeToCacheInBytes: 5000000,
};
