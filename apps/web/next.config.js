/** @type {import('next').NextConfig} */

const path = require('path');
const webpack = require("webpack");
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  webpack: (config) => {

      // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,  // preserve existing aliases
      '@components': path.join(__dirname, 'components'),
      '@styles': path.join(__dirname, 'styles'),
      // Add more aliases as needed
    };

    config.plugins.push(
      new webpack.ContextReplacementPlugin(/keyv/, (data) => {
        delete data.dependencies[0].critical;
        return data;
      })
    );
    return config;
  },

  transpilePackages: ["@repo/ui", "@repo/common", "@repo/recoil"],
   images: isDev
    ? { unoptimized: true }
    : {
        domains: ["d2szwvl7yo497w.cloudfront.net" , "appx-wsb-gcp.akamai.net.in"], //Add your domain here
      },
};
