module.exports = {
    "packagerConfig": {
      "icon": "src/assets/favicon",
      "osxSign": {
        "identity": `Developer ID Application: ${process.env.MAC_DEVELOPER_ID}`,
        "hardened-runtime": true,
        "entitlements": "src/assets/entitlements.plist",
        "entitlements-inherit": "src/assets/entitlements.plist",
        "signature-flags": "library"
      },
      "osxNotarize": {
        "appleId": process.env.MAC_APPLE_ID,
        "appleIdPassword": process.env.MAC_APPLE_ID_PWD,
      }
    },
    "makers": [
      {
        "name": "@electron-forge/maker-squirrel",
        "config": {
          "name": "barklarm",
          "setupIcon": "src/assets/favicon.ico",
          "loadingGif": "src/assets/installer.gif"
        }
      },
      {
        "name": "@electron-forge/maker-zip"
      },
      {
        "name": "@electron-forge/maker-deb",
        "config": {}
      },
      {
        "name": "@electron-forge/maker-rpm",
        "config": {}
      },
      {
        "name": "@electron-forge/maker-dmg",
        "config": {}
      }
    ],
    "plugins": [
      [
        "@electron-forge/plugin-webpack",
        {
          "mainConfig": "./webpack.main.config.js",
          "renderer": {
            "config": "./webpack.renderer.config.js",
            "entryPoints": [
              {
                "html": "./src/index.html",
                "js": "./src/renderer.ts",
                "name": "main_window",
                "preload": {
                  "js": "./src/preload.ts"
                }
              }
            ]
          }
        }
      ]
    ],
    "publishers": [
      {
        "name": "@electron-forge/publisher-github",
        "config": {
          "repository": {
            "owner": "kanekotic",
            "name": "barklarm"
          }
        }
      }
    ]
  }