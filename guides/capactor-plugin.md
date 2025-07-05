1. Create the Capacitor Plugin Skeleton
   From your Ionic project root:

```bash
# (deprecated) npx @capacitor/cli plugin:generate

npm init @capacitor/plugin
# Name: mediapipe-text-bridge
# Platform: Android only
```

2. Fill in the details:

| Field          | Example Value                            |
| -------------- | ---------------------------------------- |
| npm package    | mediapipe-text-bridge                    |
| directory      | mediapipe-text-bridge                    |
| Package ID     | com.srikanth.plugins.mediapipetextbridge |
| class name     | MediapipeTextBridge                      |
| repository URL | https://github.com/sidharth74659/POC.git |
| author         | srikanthv                                |
| license        | MIT                                      |
| description    | mediapipe-text-bridge                    |


3. Next steps:

```bash
  - cd mediapipe-text-bridge/
  - Open CONTRIBUTING.md to learn about the npm scripts
  - Continue following these docs for plugin development: https://capacitorjs.com/docs/plugins/workflow
  - Questions? Feel free to open a discussion: https://github.com/ionic-team/capacitor/discussions
  - Learn more about the Capacitor Community: https://github.com/capacitor-community/welcome 💖
```